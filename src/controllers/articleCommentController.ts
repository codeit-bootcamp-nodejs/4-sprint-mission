import {
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
  listArticleComment,
  getArticleCommentById,
} from "../services/articleCommentService.js";
import type {
  CreateArticleCommentController,
  UpdateArticleCommentController,
  DeleteArticleCommentController,
  ListArticleCommentController,
  GetArticleCommentByIdController,
} from "../types/controller/article-comment.controller.types.js";

export const createArticleCommentController: CreateArticleCommentController =
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      const data = {
        content: req.body.content,
        articleId: req.params.articleId,
      };
      const articleComment = await createArticleComment(data);
      res.status(201).json(articleComment);
    } catch (error) {
      next(error);
    }
  };

export const updateArticleCommentController: UpdateArticleCommentController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);
      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      // 기존 댓글 조회
      const input = { commentId, articleId: req.params.articleId };
      const comment = await getArticleCommentById(input);
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      // 댓글 작성자 확인
      if (comment.userId !== req.user.id) {
        return res.status(403).json({ error: "수정 권한이 없습니다." });
      }

      const data = {
        content: req.body.content,
        commentId,
        articleId: req.params.articleId,
      };

      const atcCommentPatched = await updateArticleComment(data);
      res.status(200).json(atcCommentPatched);
    } catch (error) {
      next(error);
    }
  };

export const deleteArticleCommentController: DeleteArticleCommentController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);

      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      // 기존 댓글 조회
      const input = { commentId, articleId: req.params.articleId };
      const comment = await getArticleCommentById(input);
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      // 댓글 작성자 확인
      if (comment.userId !== req.user.id) {
        return res.status(403).json({ error: "삭제 권한이 없습니다." });
      }

      const data = { commentId, articleId: req.params.articleId };
      await deleteArticleComment(data);
      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };

export const listArticleCommentController: ListArticleCommentController =
  async (req, res, next) => {
    try {
      const articleId = Number(req.params.articleId);

      // cursor → Date 변환
      const cursor =
        typeof req.query.cursor === "string" &&
        !Number.isNaN(Date.parse(req.query.cursor))
          ? Date.parse(req.query.cursor)
          : undefined;

      // limit → number 변환
      const limit =
        typeof req.query.limit === "string" && /^\d+$/.test(req.query.limit)
          ? Number(req.query.limit)
          : undefined;

      const data = {
        articleId,
        ...(cursor ? { cursor } : {}),
        ...(limit !== undefined ? { limit } : {}),
      };
      const articleComments = await listArticleComment(data);

      const lastComment =
        articleComments.length > 0
          ? articleComments[articleComments.length - 1]
          : undefined;

      res.status(200).json({
        comments: articleComments,
        nextCursor: lastComment ? lastComment.createdAt : null,
      });
    } catch (error) {
      next(error);
    }
  };

export const getArticleCommentByIdController: GetArticleCommentByIdController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);
      const data = { commentId, articleId: req.params.articleId };
      const articleComment = await getArticleCommentById(data);
      if (!articleComment) {
        return res
          .status(404)
          .json({ error: `${commentId}에 해당하는 댓글을 찾을 수 없습니다` });
      }

      res.status(200).json(articleComment);
    } catch (error) {
      next(error);
    }
  };
