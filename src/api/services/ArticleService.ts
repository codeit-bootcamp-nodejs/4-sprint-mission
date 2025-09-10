import prisma from "../libs/prismaClient.js";
import type { CreateArticleData, UpdateArticleData, FindManyArticleParams, ArticleOrder } from "../types/article.js";
import type { CustomError } from "../types/error.js";
import { Prisma } from "@prisma/client";

const ArticleService = {
  async createArticle(articleData: CreateArticleData, userId: number) {
    const newArticle = await prisma.article.create({
      data: { ...articleData, userId },
    });
    return newArticle;
  },

  async findUniqueArticle(articleId: number, userId?: number) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!userId) {
      return { ...article, isLiked: false };
    }

    const like = await prisma.like.findFirst({
      where: { userId, articleId },
    });
    return { ...article, isLiked: !!like };
  },

  async updateArticle(id: number, updateData: UpdateArticleData, userId: number) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      const error: CustomError = new Error("존재하지 않는 게시글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: CustomError = new Error("게시글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await prisma.article.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteArticle(id: number, userId: number) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      const error: CustomError = new Error("존재하지 않는 게시글입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: CustomError = new Error("게시글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.article.delete({
      where: { id },
    });
  },

  async findManyArticle({ offset, limit, order, keyword }: FindManyArticleParams) {
    let orderBy: Prisma.ArticleOrderByWithRelationInput;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }

    let where = {};

    if (keyword) {
      where = {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      };
    }

    const articles = await prisma.article.findMany({
      select: { id: true, title: true, content: true, createdAt: true },
      skip: offset,
      take: limit,
      orderBy,
      where,
    });
    return articles;
  },
};

export default ArticleService;
