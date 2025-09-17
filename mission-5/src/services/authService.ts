import { passwordHashing, validatePassword } from '@lib/bcrypt.js';
import { generateToken, verifyAccessToken, verifyRefreshToken } from '@lib/jwtToken.js';
import prisma from '@lib/prisma.js';
import { redisClient } from '@lib/redis.js';
import { REDIS_KEY } from '@lib/constants.js';
import type { Login, Signup } from '@/types/auth.types.js';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors.js';
import type { AuthRepository } from '@/repositories/auths.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class AuthService {
  constructor(@inject(TYPES.AuthRepository) private readonly authRepository: AuthRepository) {}
  async signup({ email, nickname, password }: Signup) {
    const hashedPassword = await passwordHashing(password);
    const user = await this.authRepository.create({ email, nickname, hashedPassword });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ received_email, received_password }: Login) {
    const { id, password } = await this.authRepository.findByEmail({ received_email });
    const isPasswordValid = await validatePassword(received_password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
    }
    const { accessToken, refreshToken } = generateToken(id);
    await this.authRepository.update({ userId: id, refreshToken });
    return { accessToken, refreshToken };
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
    const isBlacklisted = await redisClient.get(`${REDIS_KEY}:${received_refreshToken}`);
    if (isBlacklisted) {
      throw new UnauthorizedError('만료된 리프레시 토큰입니다.');
    }
    return prisma.$transaction(async (tx) => {
      // 토큰 검증, 유효성 확인, 재발급, db 업데이트를 트랜잭션으로 묶기
      const result = verifyRefreshToken(received_refreshToken);
      const { id, refreshToken } = await this.authRepository.findById({
        tx,
        userId: result['userId'],
      });
      if (!refreshToken || refreshToken !== received_refreshToken) {
        throw new ForbiddenError('유효하지 않은 리프레시 토큰입니다.');
      }
      const { accessToken, refreshToken: newRefreshToken } = generateToken(id);
      await this.authRepository.update({ tx, userId: id, refreshToken });
      if (typeof result.exp !== 'number') {
        throw new UnauthorizedError('유효하지 않은 토큰입니다 (만료 시간 없음).');
      }
      const remainingTime = result.exp - Math.floor(Date.now() / 1000);
      await redisClient.set(`${REDIS_KEY}:${refreshToken}`, 'blacklisted', {
        EX: remainingTime,
      });
      return { accessToken, refreshToken: newRefreshToken };
    });
  }
}
