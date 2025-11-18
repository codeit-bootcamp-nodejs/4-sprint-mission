import type { Request, Response, NextFunction } from "express";
import { productCommentsService } from "../services/productCommentsService";

export const productCommentsController = {
  getProductsComments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = Number(req.params.productId);
      const rawCursor = req.query.cursor;
      const cursor =
        typeof rawCursor === "string" ? parseInt(rawCursor, 10) : undefined;
      const limit = Number(req.query.limit) || 10;

      const productComments = await productCommentsService.getProductsComments(
        productId,
        cursor,
        limit
      );

      res.status(200).json(productComments);
    } catch (err) {
      next(err);
    }
  },

  createProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = Number(req.params.productId);
      const userId = Number(req.user!.id);
      const { content } = req.body;

      const comment = await productCommentsService.createProductComment(
        productId,
        content,
        userId
      );

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  },

  updateProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentId = Number(req.params.commentId);
      const productId = Number(req.params.productId);
      const userId = Number(req.user!.id);
      const { content } = req.body;

      const comment = await productCommentsService.updateProductComment(
        productId,
        commentId,
        content,
        userId
      );

      res.status(200).json(comment);
    } catch (err) {
      next(err);
    }
  },

  deleteProductComment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentId = Number(req.params.commentId);
      const productId = Number(req.params.productId);
      const userId = Number(req.user!.id);

      await productCommentsService.deleteProductComment(
        commentId,
        productId,
        userId
      );

      res.status(200).json({ message: `ID:${commentId} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  },
};
