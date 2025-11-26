import { prisma } from '../../lib/prismaClient.js';

class ProductCommentRepository {
  findByProductId(productId: number) {
    return prisma.comment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(productId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        userId,
        productId,
      },
    });
  }

  async countByCommentIds(commentIds: number[]) {
    return prisma.commentLike.groupBy({
      by: ['commentId'],
      _count: { commentId: true },
      where: { commentId: { in: commentIds } },
    });
  }

  async findByUserAndCommentIds(userId: number, commentIds: number[]) {
    return prisma.commentLike.findMany({
      where: { userId, commentId: { in: commentIds } },
      select: { commentId: true },
    });
  }
}

export const productCommentRepository = new ProductCommentRepository();
