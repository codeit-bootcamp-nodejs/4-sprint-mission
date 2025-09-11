import { prisma } from '../lib/prismaClient.js';
import type { UserUpdateData } from '../types/user-types.js';

class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: {
    username: string;
    email: string;
    password: string;
  }) {
    return prisma.user.create({ data });
  }

  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        images: true,
      },
    });
  }

  async updateUser(userId: number, updateData: UserUpdateData) {
    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        username: true,
        email: true,
        images: true,
      },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async getUserComments(userId: number) {
    return prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        content: true,
        article: { select: { id: true, title: true } },
        product: { select: { id: true, name: true } },
        likeCount: true,
      },
    });
  }

  async getUserLikedComments(userId: number) {
    return prisma.comment.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
  }
}

export const userRepository = new UserRepository();
