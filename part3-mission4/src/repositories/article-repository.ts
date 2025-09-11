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
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        images: true,
        userId: true,
        likeCount: true,
        ...(userId && {
          likedBy: { where: { id: userId }, select: { id: true } },
        }),
        comments: {
          select: {
            id: true,
            content: true,
            likeCount: true,
            ...(userId && {
              likedBy: { where: { id: userId }, select: { id: true } },
            }),
          },
        },
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
        likeCount: true,
      },
    });
  }

  async findLikedArticles(userId: number) {
    return prisma.article.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
  }

  async likeArticle(userId: number, articleId: number) {
    return prisma.article.update({
      where: { id: articleId },
      data: {
        likedBy: { connect: { id: userId } },
        likeCount: { increment: 1 },
      },
    });
  }

  async unlikeArticle(userId: number, articleId: number) {
    return prisma.article.update({
      where: { id: articleId },
      data: {
        likedBy: { disconnect: { id: userId } },
        likeCount: { decrement: 1 },
      },
    });
  }
}

export const articleRepository = new ArticleRepository();
