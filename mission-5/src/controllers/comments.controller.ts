import { Request, Response, NextFunction } from 'express';
import { CommentsService } from '../services/comments.service.js';

export class CommentsController {
  commentsService = new CommentsService();

  // 댓글 생성 (게시글)
  createArticleComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const { content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (isNaN(parseInt(articleId))) {
        return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      }

      const comment = await this.commentsService.createArticleComment(
        +articleId,
        content,
        userId,
      );

      return res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 생성 (상품)
  createProductComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (isNaN(parseInt(productId))) {
        return res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      }

      const comment = await this.commentsService.createProductComment(
        +productId,
        content,
        userId,
      );

      return res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 조회 (게시글)
  getArticleComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;

      if (isNaN(parseInt(articleId))) {
        return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      }

      const comments = await this.commentsService.getArticleComments(+articleId);

      return res.status(200).json({ data: comments });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 조회 (상품)
  getProductComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      if (isNaN(parseInt(productId))) {
        return res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      }

      const comments = await this.commentsService.getProductComments(+productId);

      return res.status(200).json({ data: comments });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 수정
  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (isNaN(parseInt(commentId))) {
        return res.status(400).json({ message: '유효하지 않은 댓글 ID입니다.' });
      }

      const updatedComment = await this.commentsService.updateComment(
        +commentId,
        content,
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
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (isNaN(parseInt(commentId))) {
        return res.status(400).json({ message: '유효하지 않은 댓글 ID입니다.' });
      }

      await this.commentsService.deleteComment(+commentId, userId);

      return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
