import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../service/comment-service';
import { CreateCommentDto, UpdateCommentDto } from '../types/dto';

export class CommentController {
  constructor(private commentService: CommentService) {}

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const createCommentDto: CreateCommentDto = req.body;
      const { productId, articleId } = req.params;
      const newComment = await this.commentService.createComment(
        userId,
        createCommentDto,
        productId,
        articleId,
      );
      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, articleId } = req.params;
      const limit = parseInt((req.query.limit as string) || '10');
      const cursor = req.query.cursor
        ? parseInt(req.query.cursor as string)
        : undefined;

      const comments = await this.commentService.getComments(
        productId,
        articleId,
        limit,
        cursor,
      );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { commentId } = req.params;
      const updateCommentDto: UpdateCommentDto = req.body;
      const updatedComment = await this.commentService.updateComment(
        userId,
        commentId,
        updateCommentDto,
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { commentId } = req.params;
      await this.commentService.deleteComment(userId, commentId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}