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

export const createArticleComment = async (articleId, content, userId) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      const error = new Error("게시글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId,
      },
    });

    return comment;
  } catch (err) {
    throw err;
  }
};

export const updateArticleComment = async (
  articleId,
  commentId,
  content,
  userId
) => {
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

    if (comment.userId !== userId) {
      throw new Error("댓글을 수정할 권한이 없습니다.");
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

export const removeArticleComment = async (commentId, articleId, userId) => {
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

    if (comment.userId !== userId) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }

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
