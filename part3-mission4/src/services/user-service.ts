import { prisma } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import { verifyRefreshToken, generateTokens } from '../lib/token.js';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';
import AppError from '../lib/appError.js';
import type { Response } from 'express';

type PrismaUpdateArg = Parameters<typeof prisma.user.update>[0];
type UserUpdateData = PrismaUpdateArg extends { data?: infer D }
  ? D
  : Record<string, unknown>;
type RawUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
type UserWithoutPassword = Omit<RawUser, 'password'>;

class UserService {
  // 유저 등록
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<UserWithoutPassword> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userCheck = await prisma.user.findUnique({
      where: { username },
    });
    if (userCheck) {
      throw new AppError('이미 사용 중인 닉네임입니다.', 409);
    }
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 로그인
  async login(userId: number) {
    const { accessToken, refreshToken } = generateTokens(userId);
    return { accessToken, refreshToken };
  }

  // 유저 정보 조회
  async getUserProfile(userId: number) {
    const getUserProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        images: true,
      },
    });
    return getUserProfile;
  }

  // 유저 정보 수정
  async updateUserProfile(
    userId: number,
    updateData: UserUpdateData
  ): Promise<{ username: string; email: string; images: string[] | null }> {
    const updateUserProfile = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        username: true,
        email: true,
        images: true,
      },
    });
    return updateUserProfile;
  }

  // 비밀번호 수정
  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<UserWithoutPassword> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError('사용자를 찾을 수 없습니다.', 404);

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) throw new AppError('현재 비밀번호가 일치하지 않습니다.');

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld)
      throw new AppError('기존 비밀번호로는 변경할 수 없습니다.');

    const hashed = await bcrypt.hash(newPassword, 10);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    // 비밀번호 제거 후 반환
    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  // 본인 댓글 조회
  async getUserComments(userId: number) {
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        content: true,
        article: {
          select: {
            id: true,
            title: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        likeCount: true,
      },
    });
    return comments;
  }

  // 자신이 좋아요한 댓글 조회
  async getUserLikedComments(userId: number) {
    const likedComments = await prisma.comment.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
    return likedComments;
  }

  // 토큰 세팅
  setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });
  }

  // 토큰 클리어
  clearTokenCookies(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }

  // 리프레시 토큰
  async refreshTokens(refreshToken: string, res: Response): Promise<string> {
    const { userId } = verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(userId);
    this.setTokenCookies(res, accessToken, newRefreshToken);
    return accessToken;
  }
}

export const userService = new UserService();
