import prisma from "../prismaClient.js";

const ArticleService = {
  async createArticle(articleData, userId) {
    const newArticle = await prisma.article.create({
      data: { ...articleData, userId },
    });
    return newArticle;
  },

  async findUniqueArticle(id) {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    return article;
  },

  async updateArticle(id, updateData, userId) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (article.userId != userId) {
      const error = new Error("게시글을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    return await prisma.article.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteArticle(id, userId) {
    const article = await prisma.article.findUnique({ where: { id } });

    if (article.userId != userId) {
      const error = new Error("게시글을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.article.delete({
      where: { id },
    });
  },

  async findManyArticle({ offset, limit, order, keyword }) {
    let orderBy;
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
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy,
      where,
    });
    return articles;
  },
};

export default ArticleService;
