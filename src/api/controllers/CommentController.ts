import CommentService from "../services/CommentService.js";
import type { Request, Response, NextFunction } from "express";
import type { CommentDto } from "../types/dtos/comment.dto.js";

const CommentController = {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const commentData: CommentDto = req.body;

      const newComment = await CommentService.createComment({
        ...commentData,
        userId,
      });
      res.status(201).json(newComment);
    } catch (err) {
      if (err.code === "P2003") {
        const target = req.body.productId ? "상품" : "게시글";
        return res.status(404).json({ error: `존재하지 않는 ${target}` });
      }
      next(err);
    }
  },

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const updateData: CommentDto = req.body;

      const comment = await CommentService.updateComment(Number(id), updateData, userId);
      res.status(201).json(comment);
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      next(err);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      await CommentService.deleteComment(Number(id), userId);
      res.status(201).json({ success: "댓글 삭제" });
    } catch (err) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "해당 댓글이 존재하지 않음" });
      }
      next(err);
    }
  },

  async findManyComment(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query;

      const productId = typeof q.productId === "string" ? Number(q.productId) : undefined;
      const articleId = typeof q.articleId === "string" ? Number(q.articleId) : undefined;
      const cursor = typeof q.cursor === "string" ? q.cursor : undefined;
      const limit = typeof q.limit === "string" ? parseInt(q.limit, 10) : 10;

      if (productId !== undefined && articleId !== undefined) {
        return res.status(400).json({ error: "productId 혹은 articleId 둘 중 하나만 있어야 함" });
      }

      const comments = await CommentService.findManyComment({
        ...(productId !== undefined && { productId }),
        ...(articleId !== undefined && { articleId }),
        ...(cursor !== undefined && { cursor }),
        limit,
      });

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  },
};

export default CommentController;
