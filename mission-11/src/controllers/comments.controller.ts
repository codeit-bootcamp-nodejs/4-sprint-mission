import { Request, Response, NextFunction } from 'express';
import { CommentsService } from '../services/comments.service.js';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto.js';
import { UnauthorizedError } from '../errors/http-error.js';

export class CommentsController {
  commentsService = new CommentsService();

  // 게시글 댓글 생성
  createArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { articleId } = req.params;
      const createCommentDto: CreateCommentDto = req.body;
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      const newComment = await this.commentsService.createArticleComment(
        +articleId,
        createCommentDto,
        userId,
      );

      return res.status(201).json({ data: newComment });
    } catch (err) {
      next(err);
    }
  };

  // 상품 댓글 생성
  createProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const createCommentDto: CreateCommentDto = req.body;
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      const newComment = await this.commentsService.createProductComment(
        +productId,
        createCommentDto,
        userId,
      );

      return res.status(201).json({ data: newComment });
    } catch (err) {
      next(err);
    }
  };

  // 게시글 댓글 목록 조회
  getArticleComments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { articleId } = req.params;
      const articleComments = await this.commentsService.getArticleComments(
        +articleId,
      );
      return res.status(200).json({ data: articleComments });
    } catch (err) {
      next(err);
    }
  };

  // 상품 댓글 목록 조회
  getProductComments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const productComments = await this.commentsService.getProductComments(
        +productId,
      );
      return res.status(200).json({ data: productComments });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 수정
  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const updateCommentDto: UpdateCommentDto = req.body;
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      const updatedComment = await this.commentsService.updateComment(
        +commentId,
        updateCommentDto,
        userId,
      );

      return res.status(200).json({ data: updatedComment });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 삭제
  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const userId = user.id;

      await this.commentsService.deleteComment(+commentId, userId);

      return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
