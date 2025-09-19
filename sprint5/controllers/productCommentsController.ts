import type { Request, Response, NextFunction } from "express";
import {
  createProductComment,
  findProductsComments,
  removeProductComment,
  updateProductComment,
} from "../services/productCommentsService.js";

export const getProductsComments = async (
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

    const productComments = await findProductsComments(
      productId,
      cursor,
      limit
    );

    if (productComments.length === 0) {
      return res
        .status(400)
        .json({ message: "선택한 범위 내 댓글을 찾을 수 없습니다." });
    }

    res.status(200).json(productComments);
  } catch (err) {
    next(err);
  }
};

export const postProductComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);
    const userId = Number(req.user!.id);
    const { content } = req.body;

    const comment = await createProductComment(productId, content, userId);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const patchProductComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);
    const productId = Number(req.params.productId);
    const userId = Number(req.user!.id);
    const { content } = req.body;

    const comment = await updateProductComment(
      productId,
      commentId,
      content,
      userId
    );

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

export const deleteProductComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = Number(req.params.commentId);
    const productId = Number(req.params.productId);
    const userId = Number(req.user!.id);

    await removeProductComment(commentId, productId, userId);

    res.status(200).json({ message: `ID:${commentId} 삭제 완료` });
  } catch (err) {
    next(err);
  }
};
