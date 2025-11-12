import prisma from '../../utils/prisma.js';

class AuthRepository {
  find = async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  };

  createRefreshToken = async (token: string, userId: number, expiresAt: Date) => {
    prisma.refreshToken.create({
      data: {
        token,
        user: { connect: { id: userId } },
        expiresAt,
      },
    });
  };

  delete = async (userId: number) => {
    prisma.refreshToken.delete({ where: { userId: userId } });
  };
}

export const authRepository = new AuthRepository();
