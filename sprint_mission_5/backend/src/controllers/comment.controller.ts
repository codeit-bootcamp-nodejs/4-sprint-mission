import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/service.container.js';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
} from '../dto/index.js';
import { AuthRequest } from '../types/auth.js';

interface AuthRequestExtended extends Request, AuthRequest {}

export const createProductComment = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const productId = parseInt(req.params['productId']!, 10);
    const { content }: CreateCommentDto = req.body;

    if (isNaN(productId)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    if (!content) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    const commentService = serviceContainer.getCommentService();
    const comment = await commentService.createComment({
      content,
      userId: req.user.id,
      productId,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const createArticleComment = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const articleId = parseInt(req.params['articleId']!, 10);
    const { content }: CreateCommentDto = req.body;

    if (isNaN(articleId)) {
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    if (!content) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    const commentService = serviceContainer.getCommentService();
    const comment = await commentService.createComment({
      content,
      userId: req.user.id,
      articleId,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getProductComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = parseInt(req.params['productId']!, 10);
    const limit = Math.min(
      50,
      Math.max(1, parseInt((req.query['limit'] as string) ?? '10', 10) || 10),
    );
    const cursor = req.query['cursor']
      ? parseInt(req.query['cursor'] as string, 10)
      : undefined;

    if (isNaN(productId)) {
      res.status(400).json({ message: '유효하지 않은 상품 ID입니다.' });
      return;
    }

    const query: CommentQueryDto = {
      limit,
      ...(cursor && { cursor }),
    };
    const commentService = serviceContainer.getCommentService();
    const result = await commentService.getProductComments(productId, query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getArticleComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const articleId = parseInt(req.params['articleId']!, 10);
    const limit = Math.min(
      50,
      Math.max(1, parseInt((req.query['limit'] as string) ?? '10', 10) || 10),
    );
    const cursor = req.query['cursor']
      ? parseInt(req.query['cursor'] as string, 10)
      : undefined;

    if (isNaN(articleId)) {
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    const query: CommentQueryDto = {
      limit,
      ...(cursor && { cursor }),
    };
    const commentService = serviceContainer.getCommentService();
    const result = await commentService.getArticleComments(articleId, query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const id = parseInt(req.params['id']!, 10);
    const { content }: UpdateCommentDto = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 댓글 ID입니다.' });
      return;
    }

    if (!content) {
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    const commentService = serviceContainer.getCommentService();
    const updatedComment = await commentService.updateComment(
      id,
      { content },
      req.user.id,
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 댓글을 수정할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteComment = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const id = parseInt(req.params['id']!, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 댓글 ID입니다.' });
      return;
    }

    const commentService = serviceContainer.getCommentService();
    await commentService.deleteComment(id, req.user.id);

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 댓글을 삭제할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
