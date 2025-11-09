import prisma from "../lib/prisma.js";
import type { Article } from "../types/dto.js";

export const articleRepository = {
  getArticles: async (
    offset: number,
    limit: number,
    title: string | undefined,
    content: string | undefined
  ): Promise<Article[]> => {
    const filter = [];

    if (title) {
      filter.push({ title: { contains: title } });
    }

    if (content) {
      filter.push({ content: { contains: content } });
    }

    const where = filter.length > 0 ? { OR: filter } : {};

    return await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  createArticle: async (
    title: string,
    content: string,
    userId: number
  ): Promise<Article> => {
    return await prisma.article.create({
      data: {
        title,
        content,
        userId,
      },
    });
  },

  getArticleById: async (id: number): Promise<Article | null> => {
    return await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  updateArticle: async (
    id: number,
    title?: string,
    content?: string
  ): Promise<Article> => {
    const articleData: { title?: string; content?: string } = {};

    if (title !== undefined) {
      articleData.title = title;
    }
    if (content !== undefined) {
      articleData.content = content;
    }

    return await prisma.article.update({
      where: { id },
      data: articleData,
    });
  },

  deleteArticle: async (id: number): Promise<void> => {
    await prisma.article.delete({ where: { id } });
  },

  findLikedArticles: async (userId: number, articleIds: number[]) => {
    return await prisma.like.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
      select: {
        articleId: true,
        userId: true,
      },
    });
  },
};
