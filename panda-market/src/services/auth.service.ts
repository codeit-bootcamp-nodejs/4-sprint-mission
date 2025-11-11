import { passwordHashing, validatePassword } from '@/lib/bcrypt.js';
import {
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/jwtToken.js';
import { redisClient } from '@/lib/redis.js';
import {
  GOOGLE_CLIENT_ID,
  KAKAO_CLIENT_API_KEY,
  KAKAO_CLIENT_SECRET,
  KAKAO_REDIRECT_URI,
  REDIS_KEY,
} from '@/lib/constants.js';
import type { Login, Signup } from '@/types/auth.types.js';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from '@/lib/errors.js';
import type { AuthRepository } from '@/repositories/auths.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import client from '@/lib/google-oauth.js';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client.js';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}
  async signup({ email, nickname, password }: Signup) {
    const hashedPassword = await passwordHashing(password);
    const createData = {
      email,
      nickname,
      password: hashedPassword,
    };
    const user = await this.authRepository.create({ createData });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ received_email, received_password }: Login) {
    const currentUser = await this.authRepository.findByEmail({
      received_email,
    });
    if (!currentUser) {
      throw new UnauthorizedError('가입되어 있지 않은 사용자입니다.');
    }
    const { id, password } = currentUser;
    if (!password) {
      throw new UnauthorizedError('간편 로그인 회원입니다.');
    }
    const isPasswordValid = await validatePassword(received_password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
    }
    const { accessToken, refreshToken } = generateToken(id);
    const hashedRefreshToken = await passwordHashing(refreshToken);
    await this.authRepository.update({
      userId: id,
      refreshToken: hashedRefreshToken,
    });
    return { accessToken, refreshToken };
  }

  async googleLogin(frontRedirectUrl: string) {
    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline', // refresh token을 받기 위해 필요
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      // state 파라미터에 최종 목적지를 담아 Google에 전달
      // CSRF 공격 방지를 위해 해싱등을 통해 암호화된 값을 사용하는 것이 더 안전하다고함
      state: frontRedirectUrl,
    });
    return { authorizeUrl };
  }

  async kakaoLogin(frontRedirectUrl: string) {
    const kakaoApiKey = KAKAO_CLIENT_API_KEY;
    const kakaoRedirectUri = KAKAO_REDIRECT_URI;
    const authorizeUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoApiKey}&redirect_uri=${kakaoRedirectUri}&state=${frontRedirectUrl}`;
    return { authorizeUrl };
  }

  // 구글 로그인 콜백 처리: code와 state를 받아 토큰과 최종 목적지를 반환
  async googleLoginCallback(code: string, state: string) {
    // 1. authorization code로 access token과 id_token을 받음 (타입 명시)
    const { tokens }: GetTokenResponse = await client.getToken(code);
    client.setCredentials(tokens);

    // id_token이 없을 경우를 대비한 방어 코드
    if (!tokens.id_token) {
      throw new BadRequestError('ID token not found');
    }

    // 2. id_token을 사용하여 사용자 정보를 가져옴
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestError('Failed to get payload from ticket');
    }

    return this.prisma.$transaction(async (tx) => {
      // console.log('구글 사용자 정보:', payload);
      const sub = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      // 3. 구글 로그인 정보를 통해 유저 정보 조회
      let user = await this.authRepository.findByProviderId({
        tx,
        providerId: sub,
      });
      if (!user) {
        if (!name) {
          throw new BadRequestError('사용자 이름 없음');
        }
        if (!email) {
          throw new BadRequestError('사용자 이메일 없음');
        }
        const randomSuffix = crypto.randomBytes(4).toString('hex');
        const uniqueNickname = `${name}_${randomSuffix}`;
        const createData = {
          nickname: uniqueNickname,
          email,
          authProvider: 'google',
          providerId: sub,
          profileImage: picture,
        };
        user = await this.authRepository.create({ tx, createData });
        console.log('사용자 새로 생성 완료');
      }

      // 4. 유저 정보를 토대로 토큰 발급
      const { accessToken, refreshToken } = generateToken(user.id);
      const hashedRefreshToken = await passwordHashing(refreshToken);
      await this.authRepository.update({
        tx,
        userId: user.id,
        refreshToken: hashedRefreshToken,
      });
      console.log('구글 로그인 완료');
      return { accessToken, refreshToken, finalRedirectUrl: state }; // 구글로부터 돌려받은 최종 목적지도 전달
    });
  }

  async kakaoLoginCallback(code: string, state: string) {
    const kakaoApiKey = KAKAO_CLIENT_API_KEY;
    const kakaoRedirectUri = KAKAO_REDIRECT_URI;
    const kakaoClientSecret = KAKAO_CLIENT_SECRET;
    const kakaoApiUrl = 'https://kauth.kakao.com/oauth/token';
    const kakaoToken = await axios({
      method: 'post',
      url: kakaoApiUrl,
      data: {
        grant_type: 'authorization_code',
        client_id: kakaoApiKey,
        redirect_uri: kakaoRedirectUri,
        code: code,
        client_secret: kakaoClientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const kakaoAccessToken = kakaoToken.data.access_token;
    const kakaoUser = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: { Authorization: `Bearer ${kakaoAccessToken}` },
    });

    return this.prisma.$transaction(async (tx) => {
      // console.log(kakaoUser.data);
      const { id, kakao_account } = kakaoUser.data;
      const { profile, email } = kakao_account;
      const { nickname, thumbnail_image_url } = profile;

      // 카카오 로그인 정보를 통해 유저 정보 조회
      let user = await this.authRepository.findByProviderId({
        tx,
        providerId: String(id),
      });
      if (!user) {
        if (!nickname) {
          throw new BadRequestError('사용자 이름 없음');
        }
        if (!email) {
          throw new BadRequestError('사용자 이메일 없음');
        }
        const randomSuffix = crypto.randomBytes(4).toString('hex');
        const uniqueNickname = `${nickname}_${randomSuffix}`;
        const createData = {
          nickname: uniqueNickname,
          email,
          profileImage: thumbnail_image_url,
          authProvider: 'kakao',
          providerId: String(id),
        };
        user = await this.authRepository.create({ tx, createData });
        console.log('사용자 새로 생성 완료');
      }

      // 4. 유저 정보를 토대로 토큰 발급
      const { accessToken, refreshToken } = generateToken(user.id);
      const hashedRefreshToken = await passwordHashing(refreshToken);
      await this.authRepository.update({
        tx,
        userId: user.id,
        refreshToken: hashedRefreshToken,
      });
      console.log('카카오 로그인 완료');
      return { accessToken, refreshToken, finalRedirectUrl: state }; // 카카오로부터 돌려받은 최종 목적지도 전달
    });
  }

  async logout(accessToken: string) {
    // 토큰 추출해서 남은 유효시간 계산
    const { exp } = verifyAccessToken(accessToken);
    if (typeof exp !== 'number') {
      throw new UnauthorizedError('유효하지 않은 토큰입니다 (만료 시간 없음).');
    }
    const remainingTime = exp - Math.floor(Date.now() / 1000);

    await redisClient.set(`${REDIS_KEY}:${accessToken}`, 'blacklisted', {
      EX: remainingTime,
    });
    return { message: '로그아웃 되었습니다.' };
  }

  async refresh(received_refreshToken: string) {
    const isBlacklisted = await redisClient.get(
      `${REDIS_KEY}:${received_refreshToken}`,
    );
    if (isBlacklisted) {
      throw new UnauthorizedError('만료된 리프레시 토큰입니다.');
    }
    return this.prisma.$transaction(async (tx) => {
      // 토큰 검증, 유효성 확인, 재발급, db 업데이트를 트랜잭션으로 묶기
      const result = verifyRefreshToken(received_refreshToken);
      const { id, refreshToken } = await this.authRepository.findById({
        tx,
        userId: result['userId'],
      });

      if (
        !refreshToken ||
        !(await validatePassword(received_refreshToken, refreshToken))
      ) {
        throw new ForbiddenError('유효하지 않은 리프레시 토큰입니다.');
      }
      const { accessToken, refreshToken: newRefreshToken } = generateToken(id);
      const hashedNewRefreshToken = await passwordHashing(newRefreshToken);
      await this.authRepository.update({
        tx,
        userId: id,
        refreshToken: hashedNewRefreshToken,
      });
      if (typeof result.exp !== 'number') {
        throw new UnauthorizedError(
          '유효하지 않은 토큰입니다 (만료 시간 없음).',
        );
      }
      const remainingTime = result.exp - Math.floor(Date.now() / 1000);
      await redisClient.set(
        `${REDIS_KEY}:${received_refreshToken}`,
        'blacklisted',
        {
          EX: remainingTime,
        },
      );
      return { accessToken, refreshToken: newRefreshToken };
    });
  }
}
