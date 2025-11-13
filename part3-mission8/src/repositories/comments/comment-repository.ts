import { prisma } from '../../lib/prismaClient.js';

export const commentRepository = {
  findById(commentId: number) {
    return prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: { select: { username: true } },
      },
    });
  },

  update(commentId: number, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  },

  delete(commentId: number, userId: number) {
    return prisma.comment.deleteMany({
      where: { id: commentId, userId },
    });
  },

  // 내가 쓴 댓글들 조회
  async findUserComments(userId: number) {
    return prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // 좋아요한 댓글 조회
  async findLikedComments(userId: number) {
    return prisma.comment.findMany({
      where: { likes: { some: { userId } } },
    });
  },
};
