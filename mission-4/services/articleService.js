import prisma from "../lib/prisma.js";

async function getArticleListService({ keyword, page, pageSize }) {
  const article = await prisma.article.findMany({
    where: {
      OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return article;
}

async function postArticleService({ userId, title, content }) {
  const article = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });
  return article;
}

async function getArticleService({ id }) {
  const article = await prisma.article.findUniqueOrThrow({
    where: id,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  });
  return article;
}

async function patchArticleService({ id, data }) {
  const article = await prisma.article.update({
    where: id,
    data,
  });
  return article;
}

async function deleteArticleService({ id }) {
  const article = await prisma.article.delete({
    where: id,
  });
  return article;
}

export { getArticleListService, postArticleService, getArticleService, patchArticleService, deleteArticleService };
