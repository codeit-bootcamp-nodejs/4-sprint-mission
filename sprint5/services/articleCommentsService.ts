import { articleRepository } from "../repositories/articleRepository.js";
import { articleCommentsRepository } from "../repositories/articleCommentsRepository.js";
import { notificationRepository } from "../repositories/notificationRepository.js";
import { emitToUser } from "../utils/notificationSocket.js";
import type { ArticleComment } from "../types/dto.js";

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

      const comment = await articleCommentsRepository.createArticleComment(
        articleId,
        content,
        userId
      );

      //  본인 작성 댓글이면 알림 안 보내기
      if (article.userId && article.userId !== userId) {
        // 알림 DB 생성
        await notificationRepository.createNotification({
          userId: article.userId, // 게시글 작성자에게 알림
          type: "COMMENT",
          message: `게시글 "${article.title}"에 새 댓글이 달렸습니다.`,
          targetId: articleId,
        });

        // 실시간 전송
        emitToUser(article.userId, {
          type: "COMMENT",
          message: `게시글 "${article.title}"에 새 댓글이 달렸습니다.`,
          targetId: articleId,
        });
      }

      return comment;
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
