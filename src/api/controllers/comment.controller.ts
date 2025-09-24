import CommentService from "../services/comment/comment.service.js";
import type { Request, Response, NextFunction } from "express";
import type { RequestWithDto } from "../types/express.d.ts";
import { CreateCommentDto, UpdateCommentDto } from "../services/comment/comment.dto.js";
import { FindManyCommentsQueryDto } from "../services/comment/comment-findmany.dto.js";
import type { CustomError } from "../types/error.js";

const CommentController = {
  async createComment(req: RequestWithDto<CreateCommentDto>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const commentDto = req.body;

      const newComment = await CommentService.createComment(commentDto, userId);
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  },

  async updateComment(req: RequestWithDto<UpdateCommentDto>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const { id } = req.params;
      const commentDto = req.body;

      const comment = await CommentService.updateComment(Number(id), commentDto, userId);
      res.status(200).json(comment);
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const { id } = req.params;
      await CommentService.deleteComment(Number(id), userId);
      res.status(200).json({ success: "댓글 삭제" });
    } catch (err) {
      next(err);
    }
  },

  async findManyComment(req: Request, res: Response, next: NextFunction) {
    try {
      const params = FindManyCommentsQueryDto.from(req.query);
      const comments = await CommentService.findManyComment(params);

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  },
};

export default CommentController;
