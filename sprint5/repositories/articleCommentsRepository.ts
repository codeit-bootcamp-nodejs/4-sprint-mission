import prisma from "../lib/prisma.js";

export interface ArticleComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const articleCommentsRepository = {
  getArticleComments: async (
    articleId: number,
    limit: number,
    skip: number,
    cursor: number | undefined
  ): Promise<ArticleComment[]> => {
    try {
      return await prisma.comment.findMany({
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
    } catch (err) {
      throw err;
    }
  },

  createArticleComment: async (
    articleId: number,
    content: string,
    userId: number
  ): Promise<ArticleComment> => {
    try {
      return await prisma.comment.create({
        data: {
          content,
          articleId,
          userId,
        },
      });
    } catch (err) {
      throw err;
    }
  },

  getCommentByIdAndArticleId: async (commentId: number, articleId: number) => {
    try {
      const comment = await prisma.comment.findFirst({
        where: {
          id: commentId,
          articleId: articleId,
        },
      });

      return comment;
    } catch (err) {
      throw err;
    }
  },

  updateArticleComment: async (
    commentId: number,
    content: string
  ): Promise<ArticleComment> => {
    try {
      return await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });
    } catch (err) {
      throw err;
    }
  },

  deleteArticleComment: async (commentId: number): Promise<void> => {
    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
    } catch (err) {
      throw err;
    }
  },
};
