import { prisma } from '../../lib/prismaClient.js';

class ArticleCommentRepository {
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
  }

  create(articleId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: {
        content,
        userId,
        articleId,
      },
    });
  }
}

export const articleCommentRepository = new ArticleCommentRepository();
