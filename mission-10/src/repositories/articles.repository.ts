import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';

export class ArticlesRepository {
  createArticle = async (data: Prisma.ArticleCreateInput) => {
    return await prisma.article.create({ data });
  };

  findArticles = async () => {
    return await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  findArticleById = async (articleId: number) => {
    return await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  findArticleByIdSimple = async (articleId: number) => {
    return await prisma.article.findUnique({ where: { id: articleId } });
  };

  updateArticle = async (articleId: number, data: Prisma.ArticleUpdateInput) => {
    return await prisma.article.update({
      where: { id: articleId },
      data,
    });
  };

  deleteArticle = async (articleId: number) => {
    return await prisma.article.delete({ where: { id: articleId } });
  };

  findArticleLike = async (userId: number, articleId: number) => {
    return await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  };

  createArticleLike = async (userId: number, articleId: number) => {
    return await prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
  };

  deleteArticleLike = async (userId: number, articleId: number) => {
    return await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  };
}
