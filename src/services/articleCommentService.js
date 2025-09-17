import prisma from "../lib/prisma.js";

export async function createArticleComment(data) {
  const articleComments = await prisma.articlecomment.create({
    data,
  });
  return articleComments;
}

export async function updateArticleComment(id, data) {
  const atcCommentPatched = await prisma.articlecomment.update({
    where: { id },
    data: {
      content: data.content,
    },
  });
  return atcCommentPatched;
}

export async function deleteArticleComment(id) {
  const articleComments = await prisma.articlecomment.delete({
    where: { id },
  });
  return articleComments;
}

export async function listArticleComment(id, { cursor, limit }) {
  const articleComments = await prisma.articlecomment.findMany({
    where: {
      articleId: id,
      ...(cursor && {
        createdAt: {
          lt: new Date(cursor),
        },
      }),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return articleComments;
}

export async function getArticleCommentById(id) {
  const articleComment = await prisma.articlecomment.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
  return articleComment;
}
