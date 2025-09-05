import prisma from "../lib/prisma.js";

async function getArticleListService({ keyword, page, pageSize, userId }) {
  const articles = await prisma.article.findMany({
    where: {
      OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
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
  const results = articles.map((article) => {
    const { likes, _count, ...filteredArticle } = article;
    return {
      likeCount: article._count.likes,
      isLike: userId ? article.likes.length === 1 : false,
      ...filteredArticle,
    };
  });
  return results;
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

async function getArticleService({ articleId, userId }) {
  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id: articleId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      User: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  });
  const { likes, _count, ...filteredArticle } = article;
  const result = {
    likeCount: article._count.likes,
    isLike: userId ? article.likes.length === 1 : false,
    ...filteredArticle,
  };
  return result;
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
async function postArticleLikeService({ userId, articleId }) {
  const article = await prisma.articleLike.create({
    data: {
      userId,
      articleId,
    },
  });
  return article;
}
async function deleteArticleLikeService({ userId, articleId }) {
  const article = await prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
  return article;
}

export {
  getArticleListService,
  postArticleService,
  getArticleService,
  patchArticleService,
  deleteArticleService,
  postArticleLikeService,
  deleteArticleLikeService,
};
