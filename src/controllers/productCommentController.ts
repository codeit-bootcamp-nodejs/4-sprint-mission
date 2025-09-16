import {
  createProductComment,
  updateProductComment,
  deleteProductComment,
  listProductComment,
  getProductCommentById,
} from "../services/productCommentService.js";
import type {
  CreateProductCommentController,
  UpdateProductCommentController,
  DeleteProductCommentController,
  ListProductCommentController,
  GetProductCommentByIdController,
} from "../types/controller/product-comment.controller.types.js";

export const createProductCommentController: CreateProductCommentController =
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      const data = {
        content: req.body.content,
        productId: req.params.productId,
      };

      const productComment = await createProductComment(data);
      res.status(201).json(productComment);
    } catch (error) {
      next(error);
    }
  };

export const updateProductCommentController: UpdateProductCommentController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);

      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      // 기존 댓글 조회
      const input = { commentId, productId: req.params.productId };
      const comment = await getProductCommentById(input);
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
        productId: req.params.productId,
      };

      const pdCommentPatched = await updateProductComment(data);
      res.status(200).json(pdCommentPatched);
    } catch (error) {
      next(error);
    }
  };

export const deleteProductCommentController: DeleteProductCommentController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);

      if (!req.user) {
        return res.status(401).json({ error: "인증이 필요합니다." });
      }

      // 기존 댓글 조회
      const input = { commentId, productId: req.params.productId };
      const comment = await getProductCommentById(input);
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      // 댓글 작성자 확인
      if (comment.userId !== req.user.id) {
        return res.status(403).json({ error: "삭제 권한이 없습니다." });
      }

      const data = { commentId, productId: req.params.productId };
      await deleteProductComment(data);
      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  };

export const listProductCommentController: ListProductCommentController =
  async (req, res, next) => {
    try {
      const productId = Number(req.params.productId);

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
        productId,
        ...(cursor ? { cursor } : {}),
        ...(limit !== undefined ? { limit } : {}),
      };
      const productComments = await listProductComment(data);

      const lastComment =
        productComments.length > 0
          ? productComments[productComments.length - 1]
          : undefined;

      res.status(200).json({
        comments: productComments,
        nextCursor: lastComment ? lastComment.createdAt : null,
      });
    } catch (error) {
      next(error);
    }
  };

export const getProductCommentByIdController: GetProductCommentByIdController =
  async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);
      const data = { commentId, productId: req.params.productId };
      const productComment = await getProductCommentById(data);
      if (!productComment) {
        return res
          .status(404)
          .json({ error: `${commentId}에 해당하는 댓글을 찾을 수 없습니다` });
      }

      res.status(200).json(productComment);
    } catch (error) {
      next(error);
    }
  };
