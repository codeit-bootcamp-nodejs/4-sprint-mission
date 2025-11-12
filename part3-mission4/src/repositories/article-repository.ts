import { prisma } from '../lib/prismaClient.js';
import type { Prisma } from '@prisma/client';
import type { ArticleWithRelations } from '../types/article-types.js';

class ArticleRepository {
  async findMany(
    args: Prisma.ArticleFindManyArgs
  ): Promise<ArticleWithRelations[]> {
    return prisma.article.findMany(args) as Promise<ArticleWithRelations[]>;
  }

  async findUnique(articleId: number, userId?: number) {
    return prisma.article.findUnique({
      where: { id: articleId },
      include: {
        user: { select: { username: true } },
        comments: {
          include: {
            user: { select: { username: true } },
          },
        },
        ...(userId && {
          likes: { where: { userId }, select: { userId: true } },
        }),
      },
    });
  }

  async create(data: { title: string; content: string; userId: number }) {
    return prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async update(
    articleId: number,
    userId: number,
    updateData: Record<string, any>
  ) {
    return prisma.article.update({
      where: { id: articleId, userId },
      data: updateData,
    });
  }

  async delete(articleId: number, userId: number) {
    return prisma.article.deleteMany({
      where: { id: articleId, userId },
    });
  }

  async count(where?: Prisma.ArticleWhereInput) {
    return prisma.article.count({ where: where ?? {} });
  }

  async findUserArticles(userId: number) {
    return prisma.article.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        images: true,
      },
    });
  }

  async findLikedArticles(userId: number) {
    return prisma.article.findMany({
      where: {
        likes: { some: { userId } }, // ArticleLike 테이블 기준
      },
    });
  }
}

export const articleRepository = new ArticleRepository();
