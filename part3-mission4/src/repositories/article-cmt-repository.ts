import { prisma } from '../lib/prismaClient.js';

export const articleCommentRepository = {
  findByArticleId(articleId: number, userId?: number) {
    return prisma.comment.findMany({
      where: { articleId, productId: null },
      include: {
        user: { select: { username: true } },
        likedBy: {
          select: { id: true },
          ...(userId && { where: { id: userId } }),
        },
      },
    });
  },

  create(articleId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: articleId } },
      },
    });
  },
};
