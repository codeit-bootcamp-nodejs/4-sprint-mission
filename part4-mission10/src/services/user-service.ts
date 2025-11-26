import bcrypt from 'bcrypt';
import type { Response } from 'express';

import type { UserPublic } from '../dtos/user-dto.js';
import AppError from '../lib/appError.js';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';
import { exclude } from '../lib/exclude.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { commentLikeRepository } from '../repositories/like-repository.js';
import { userRepository } from '../repositories/user-repository.js';

class UserService {
  async register(username: string, email: string, password: string) {
    const existing = await userRepository.findByUsername(username);
    if (existing) throw new AppError('이미 사용 중인 닉네임입니다.', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({
      username,
      email,
      password: hashed,
    });

    return exclude(user, ['password']);
  }

  async login(userId: number) {
    return generateTokens(userId);
  }

  async getUserProfile(userId: number) {
    return userRepository.findById(userId);
  }

  async updateUserProfile(userId: number, updateData: UserPublic) {
    return userRepository.updateUser(userId, updateData);
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) throw new AppError('사용자를 찾을 수 없습니다.', 404);

    // 현재 비밀번호 비교
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('현재 비밀번호가 일치하지 않습니다.', 400);
    }

    // 기존 비밀번호와 동일한지 확인
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new AppError('기존 비밀번호로는 변경할 수 없습니다.', 400);
    }

    // 새 비밀번호로 업데이트
    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = await userRepository.updatePassword(userId, hashed);

    return exclude(updated, ['password']);
  }

  async getUserComments(userId: number) {
    const comments = await userRepository.getUserComments(userId);

    return Promise.all(
      comments.map(async (c) => {
        const likeCount = await commentLikeRepository.count(c.id);
        return { ...c, likeCount };
      })
    );
  }

  async getUserLikedComments(userId: number) {
    const liked = await userRepository.getUserLikedComments(userId);

    return Promise.all(
      liked.map(async (like) => {
        const c = like.comment;
        const likeCount = await commentLikeRepository.count(c.id);
        return { ...c, likeCount, isLiked: true };
      })
    );
  }

  setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
  }

  clearTokenCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }

  async refreshTokens(refreshToken: string, res: Response) {
    const { userId } = verifyRefreshToken(refreshToken);
    const tokens = generateTokens(userId);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  }
}

export const userService = new UserService();
