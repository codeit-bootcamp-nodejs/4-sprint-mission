import { prisma } from '../lib/prismaClient.js';

export const commentRepository = {
  findById(commentId: number) {
    return prisma.comment.findUnique({ where: { id: commentId } });
  },

  update(commentId: number, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  },

  delete(commentId: number, userId: number) {
    return prisma.comment.deleteMany({ where: { id: commentId, userId } });
  },

  like(userId: number, commentId: number) {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: { connect: { id: userId } },
        likeCount: { increment: 1 },
      },
    });
  },

  unlike(userId: number, commentId: number) {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: { disconnect: { id: userId } },
        likeCount: { decrement: 1 },
      },
    });
  },
};
