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

  // 비밀번호 제외 버전 (프로필 조회 등)
  async findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // 비밀번호 포함 버전 (인증/비밀번호 변경용)
  async findByIdWithPassword(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
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

  // 사용자가 작성한 댓글 조회
  async getUserComments(userId: number) {
    return prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        article: { select: { id: true, title: true } },
        product: { select: { id: true, name: true } },
        createdAt: true,
      },
    });
  }

  // 사용자가 좋아요한 댓글 조회
  async getUserLikedComments(userId: number) {
    return prisma.commentLike.findMany({
      where: { userId },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            article: { select: { id: true, title: true } },
            product: { select: { id: true, name: true } },
            createdAt: true,
          },
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
