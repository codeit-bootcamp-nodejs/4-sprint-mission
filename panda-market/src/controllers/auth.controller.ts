import type { RequestHandler } from 'express';
import { AuthService } from '@/services/auth.service.js';
import { UnauthorizedError } from '@/lib/errors.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { NODE_ENV } from '@/lib/constants.js';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService,
  ) {}

  signup: RequestHandler = async (req, res) => {
    const result = await this.authService.signup(req.body);
    return res.status(201).json(result);
  };
  login: RequestHandler = async (req, res) => {
    const { email: received_email, password: received_password } = req.body;
    const result = await this.authService.login({
      received_email,
      received_password,
    });
    return res.status(200).json(result);
  };
  googleLogin: RequestHandler = async (req, res) => {
    const frontRedirectUrl = req.query['redirectUrl'] as string;
    const { authorizeUrl } =
      await this.authService.googleLogin(frontRedirectUrl);
    res.redirect(authorizeUrl);
  };
  kakaoLogin: RequestHandler = async (req, res) => {
    const frontRedirectUrl = req.query['redirectUrl'] as string;
    const { authorizeUrl } =
      await this.authService.kakaoLogin(frontRedirectUrl);
    res.redirect(authorizeUrl);
  };
  googleLoginCallback: RequestHandler = async (req, res) => {
    const code = req.query['code'] as string;
    const state = req.query['state'] as string;
    const { accessToken, refreshToken, finalRedirectUrl } =
      await this.authService.googleLoginCallback(code, state);
    // 토큰 처리 및 최종 리디렉션
    // 리프레시 토큰은 HttpOnly 쿠키에 담아 전달
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // https에서만
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    // 액세스 토큰은 URL 쿼리 파라미터에 실어서 최종 목적지로 리디렉션
    res.redirect(`${finalRedirectUrl}?accessToken=${accessToken}`);
  };
  kakaoLoginCallback: RequestHandler = async (req, res) => {
    const code = req.query['code'] as string;
    const state = req.query['state'] as string;
    const { accessToken, refreshToken, finalRedirectUrl } =
      await this.authService.kakaoLoginCallback(code, state);
    // 토큰 처리 및 최종 리디렉션
    // 리프레시 토큰은 HttpOnly 쿠키에 담아 전달
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // https에서만
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    // 액세스 토큰은 URL 쿼리 파라미터에 실어서 최종 목적지로 리디렉션
    res.redirect(`${finalRedirectUrl}?accessToken=${accessToken}`);
  };
  logout: RequestHandler = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('사용자 요청에 토큰 없음');
      throw new UnauthorizedError();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('토큰 형식이 올바르지 않습니다.');
    }
    const result = await this.authService.logout(token);
    return res.status(200).json(result);
  };
  refresh: RequestHandler = async (req, res) => {
    const refreshTokenHeader = req.headers['x-refresh-token'];
    // refreshTokenHeader가 배열이면 첫 번째 요소를, 아니면 그 자체(문자열)를 사용
    // HTTP 표준에서 클라이언트는 동일한 헤더 이름으로 여러번 보낼 수 있음
    // 그래서 타입스크립트에서는 headers의 타입을 string | string[] | undefined로 추론함
    const refreshToken = Array.isArray(refreshTokenHeader)
      ? refreshTokenHeader[0]
      : refreshTokenHeader;
    if (!refreshToken) {
      throw new UnauthorizedError('인증이 유효하지 않습니다.');
    }
    const result = await this.authService.refresh(refreshToken);
    return res.status(200).json(result);
  };
}
