import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';

export class UsersRepository {
  findUserByEmailOrNickname = async (email: string, nickname: string) => {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
    return user;
  };

  findUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  };

  findUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  };

  createUser = async (userData: Prisma.UserCreateInput) => {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  };

  createRefreshToken = async (userId: number, token: string) => {
    const createdToken = await prisma.refreshToken.create({
      data: {
        userId,
        token,
      },
    });
    return createdToken;
  };

  findOtherUserByNickname = async (nickname: string, userId: number) => {
    const user = await prisma.user.findFirst({
      where: {
        nickname,
        id: { not: userId },
      },
    });
    return user;
  };

  updateUser = async (userId: number, dataToUpdate: Prisma.UserUpdateInput) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  };
  
  updateUserPassword = async (userId: number, hashedPassword: string) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return updatedUser;
  };

  deleteRefreshTokensByUserId = async (userId: number) => {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  };

  findRefreshToken = async (token: string) => {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    return storedToken;
  };
}
