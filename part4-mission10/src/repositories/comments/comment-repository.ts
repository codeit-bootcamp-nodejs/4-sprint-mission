import { prisma } from '../../lib/prismaClient.js';

class CommentRepository {
  findById(commentId: number) {
    return prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: { select: { username: true } },
      },
    });
  }

  update(commentId: number, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  delete(commentId: number, userId: number) {
    return prisma.comment.deleteMany({
      where: { id: commentId, userId },
    });
  }
}

export const commentRepository = new CommentRepository();
