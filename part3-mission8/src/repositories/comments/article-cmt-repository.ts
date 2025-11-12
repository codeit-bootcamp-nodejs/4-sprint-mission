import { prisma } from '../../lib/prismaClient.js';

export const articleCommentRepository = {
  findByArticleId(articleId: number) {
    return prisma.comment.findMany({
      where: { articleId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(articleId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      },
    });
  },
};
