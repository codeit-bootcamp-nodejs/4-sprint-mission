import { articleRepository } from "../repositories/articleRepository.js";
import { articleCommentsRepository } from "../repositories/articleCommentsRepository.js";
import type { ArticleComment } from "../repositories/articleCommentsRepository.js";

export const articleCommentsService = {
  getArticleComments: async (
    articleId: number,
    cursor: number | undefined,
    limit: number
  ): Promise<ArticleComment[]> => {
    try {
      let skip = 0;
      if (cursor) {
        skip = 1;
      }

      const aritcleComments =
        await articleCommentsRepository.getArticleComments(
          articleId,
          limit,
          skip,
          cursor
        );

      if (aritcleComments.length === 0) {
        const error: HttpError = new Error(
          "선택한 범위 내 댓글을 찾을 수 없습니다."
        );
        error.status = 404;
        throw error;
      }

      return aritcleComments;
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
      const article = await articleRepository.getArticleById(articleId);

      if (!article) {
        const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      return await articleCommentsRepository.createArticleComment(
        articleId,
        content,
        userId
      );
    } catch (err) {
      throw err;
    }
  },

  updateArticleComment: async (
    articleId: number,
    commentId: number,
    content: string,
    userId: number
  ): Promise<ArticleComment> => {
    try {
      const comment =
        await articleCommentsRepository.getCommentByIdAndArticleId(
          commentId,
          articleId
        );

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

      return await articleCommentsRepository.updateArticleComment(
        commentId,
        content
      );
    } catch (err) {
      throw err;
    }
  },

  deleteArticleComment: async (
    commentId: number,
    articleId: number,
    userId: number
  ): Promise<void> => {
    try {
      const comment =
        await articleCommentsRepository.getCommentByIdAndArticleId(
          commentId,
          articleId
        );

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

      await articleCommentsRepository.deleteArticleComment(commentId);
    } catch (err) {
      throw err;
    }
  },
};
