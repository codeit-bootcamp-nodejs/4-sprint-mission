import prisma from '../prismaClient.js';

const articleService = {
  async createArticle(data) {
    const newArticle = await prisma.article.create({
      data,
    });
    return newArticle;
  },

  async getArticleById(id) {
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAT: true,
      },
    });
    return article;
  },

  async updateArticle(id, data) {
    const articlePatched = await prisma.article.update({
      where: { id },
      data,
    });
    return articlePatched;
  },

  async deleteArticle(id) {
    const article = await prisma.article.delete({
      where: { id },
    });
    return article;
  },

  async listArticle({ page, pageSize, keyword }) {
    const where = keyword
      ? {
          OR: [
            {
              title: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return articles;
  },
};

export default articleService;
