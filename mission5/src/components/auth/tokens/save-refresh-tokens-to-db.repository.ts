import prisma from '@config/prisma.js';

/**
 * 리프레시 토큰을 DB에 저장
 * @param userId - 토큰 소유자 사용자 ID
 * @param refreshToken - 발급된 리프레시 토큰
 */

export const saveRefreshTokenToDB = async (
  userId: number,
  refreshToken: string,
) => {
  try {
    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 토큰 만료 시간: 15 일
      },
    });
  } catch (err) {
    throw new Error('Failed to save refresh token');
  }
};
