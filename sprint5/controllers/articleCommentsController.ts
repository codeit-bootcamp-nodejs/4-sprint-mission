import type { Request, Response, NextFunction } from "express";
import { articleCommentsService } from "../services/articleCommentsService.js";

export const aritcleCommentsController = {
  getArticleComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const articleId = Number(req.params.articleId);
      const rawCursor = req.query.cursor;
      const cursor =
        typeof rawCursor === "string" ? parseInt(rawCursor, 10) : undefined;
      const limit = Number(req.query.limit) || 10;

      const aritcleComments = await articleCommentsService.getArticleComments(
        articleId,
        cursor,
        limit
      );

      res.status(200).json(aritcleComments);
    } catch (err) {
      next(err);
    }
  },

  createArticleComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const articleId = Number(req.params.articleId);
      const userId = Number(req.user!.id);
      const { content } = req.body;

      const comment = await articleCommentsService.createArticleComment(
        articleId,
        content,
        userId
      );

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },

  updateArticleComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentId = Number(req.params.commentId);
      const articleId = Number(req.params.articleId);
      const userId = Number(req.user!.id);
      const { content } = req.body;

      const comment = await articleCommentsService.updateArticleComment(
        articleId,
        commentId,
        content,
        userId
      );

      res.status(200).json(comment);
    } catch (err) {
      next(err);
    }
  },

  deleteArticleComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentId = Number(req.params.commentId);
      const articleId = Number(req.params.articleId);
      const userId = Number(req.user!.id);

      await articleCommentsService.deleteArticleComment(
        commentId,
        articleId,
        userId
      );

      res.status(200).json({ message: `ID:${commentId} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  },
};
