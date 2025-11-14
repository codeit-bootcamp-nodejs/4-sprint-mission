import prisma from '../../utils/prisma.js';
import type { CreateRefreshTokenInput } from './auth.type.js';

class AuthRepository {
  findRefreshToken = async (userId: number) => {
    return await prisma.refreshToken.findUnique({
      where: { userId },
    });
  };

  find = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  };

  createRefreshToken = async (createData: CreateRefreshTokenInput) => {
    // 기존 토큰이 있으면 삭제
    await prisma.refreshToken.deleteMany({
      where: { userId: createData.userId },
    });
    // 새 토큰 생성
    return await prisma.refreshToken.create({
      data: {
        token: createData.token,
        user: { connect: { id: createData.userId } },
        expiresAt: createData.expiresAt,
      },
    });
  };

  delete = async (userId: number) => {
    return await prisma.refreshToken.delete({ where: { userId } });
  };
}

export const authRepository = new AuthRepository();
