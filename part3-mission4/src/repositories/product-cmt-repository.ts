import { prisma } from '../lib/prismaClient.js';

export const productCommentRepository = {
  findByProductId(productId: number, userId?: number) {
    return prisma.comment.findMany({
      where: { productId, articleId: null },
      include: {
        user: { select: { username: true } },
        likedBy: {
          select: { id: true },
          ...(userId && { where: { id: userId } }),
        },
      },
    });
  },

  create(productId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });
  },
};
