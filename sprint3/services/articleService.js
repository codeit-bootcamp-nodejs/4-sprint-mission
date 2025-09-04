import prisma from "../lib/prisma.js";

export const getArticles = async (offset, limit, title, content) => {
  try {
    const filter = [];

    if (title) {
      filter.push({ title: { contains: title } });
    }

    if (content) {
      filter.push({ content: { contains: content } });
    }

    const where = filter.length > 0 ? { OR: filter } : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    return articles;
  } catch (err) {
    throw err;
  }
};

export const createArticle = async (title, content) => {
  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    return article;
  } catch (err) {
    throw err;
  }
};

export const findArticleById = async (id) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    return article;
  } catch (err) {
    throw err;
  }
};

export const updateArticle = async (id, title, content) => {
  try {
    const articleData = {};

    if (title !== undefined) {
      articleData.title = title;
    }
    if (content !== undefined) {
      articleData.content = content;
    }

    const article = await prisma.article.update({
      where: { id },
      data: articleData,
    });

    return article;
  } catch (err) {
    throw err;
  }
};

export const removeArticle = async (id) => {
  try {
    await prisma.article.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};
