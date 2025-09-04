import prisma from "../lib/prisma.js";

export const findArticleComments = async (articleId, cursor, limit) => {
  try {
    const aritcleComments = await prisma.comment.findMany({
      where: { articleId },
      take: parseInt(limit, 10),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    return aritcleComments;
  } catch (err) {
    throw err;
  }
};

export const createArticleComment = async (articleId, content) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
      },
    });

    return comment;
  } catch (err) {
    throw err;
  }
};

export const updateArticleComment = async (articleId, commentId, content) => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });

    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    const updatedArticleComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return updatedArticleComment;
  } catch (err) {
    throw err;
  }
};

export const removeArticleComment = async (commentId, articleId) => {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });
  } catch (err) {
    throw err;
  }
};
