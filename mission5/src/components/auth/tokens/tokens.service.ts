import prisma from '@config/prisma.js';
import { generateTokens, verifyRefreshToken } from '@config/token.js';
import { AppError, UnauthorizedError } from '@utils/app-error.js';

export const refreshTokenService = async (refreshToken: string) => {
  // Refresh Token 존재 확인
  if (!refreshToken) throw new AppError('Refresh Token 필요');
  // JWT 검증
  let payload: { userId: number };
  try {
    payload = verifyRefreshToken(refreshToken) as { userId: number };
  } catch {
    throw new UnauthorizedError('유효하지 않은 Refresh Token');
  }
  // DB 저장 여부 확인
  const saved = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!saved) throw new UnauthorizedError('DB에 존재하지 않는 Refresh Token');

  // 만료 여부 확인
  if (saved.expiresAt < new Date()) {
    // 만료된 토큰은 DB에서 제거
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new UnauthorizedError('Refresh Token 만료됨');
  }

  // 새로운 Access Token 발급
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    payload.userId,
  );

  // 새로운 Refresh Token 발급
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return accessToken;
};
