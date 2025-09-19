import prisma from "../lib/prisma.js";

interface ArticleComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const findArticleComments = async (
  articleId: number,
  cursor: number | undefined,
  limit: number
): Promise<ArticleComment[]> => {
  try {
    let skip = 0;
    if (cursor) {
      skip = 1;
    }

    const articleComments = await prisma.comment.findMany({
      where: { articleId },
      take: limit,
      skip,
      ...(cursor ? { cursor: { id: cursor } } : {}), // cursor가 있을 때만 cursor 필드 추가
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    return articleComments;
  } catch (err) {
    throw err;
  }
};

export const createArticleComment = async (
  articleId: number,
  content: string,
  userId: number
): Promise<ArticleComment> => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
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
  articleId: number,
  commentId: number,
  content: string,
  userId: number
): Promise<ArticleComment> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });

    if (!comment) {
      const error: HttpError = new Error("댓글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error: HttpError = new Error("댓글을 수정할 권한이 없습니다.");
      error.status = 403;
      throw error;
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

export const removeArticleComment = async (
  commentId: number,
  articleId: number,
  userId: number
): Promise<void> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });

    if (!comment) {
      const error: HttpError = new Error("댓글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error: HttpError = new Error("댓글을 삭제할 권한이 없습니다.");
      error.status = 403;
      throw error;
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
