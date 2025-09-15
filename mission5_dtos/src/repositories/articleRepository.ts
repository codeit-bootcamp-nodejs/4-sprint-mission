import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class ArticleRepository {
  async createArticle(data: { userId: number, title: string, content: string }) {
    return prisma.article.create({ data });
  }

  async findMany(where: Prisma.ArticleWhereInput, skip: number, take: number) {
    return prisma.article.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where,
    });
  }

  async findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  }

  async updatedArticle(id: number, data: Partial<{ title: string, content: string }>) {
    return prisma.article.update({ where: { id }, data });
  }

  async deleteArticle(id: number) {
    return prisma.article.delete({ where: { id } });
  }
}