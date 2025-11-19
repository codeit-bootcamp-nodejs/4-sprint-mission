import { Response } from 'express';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, GetCommentsQueryDto } from './comments.dto';
import prisma from '../../shared/database/prisma.client';

const repository = new CommentsRepository(prisma);
const service = new CommentsService(repository);

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = GetCommentsQueryDto.parse({
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      productId: req.query.productId ? parseInt(req.query.productId as string, 10) : undefined,
      articleId: req.query.articleId ? parseInt(req.query.articleId as string, 10) : undefined,
    });

    const result = await service.getComments(query);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid query parameters', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const getCommentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }

    const comment = await service.getCommentById(id);
    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error && error.message === 'Comment not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const commentData = CreateCommentDto.parse({
      ...req.body,
      productId: req.body.productId ? parseInt(req.body.productId, 10) : undefined,
      articleId: req.body.articleId ? parseInt(req.body.articleId, 10) : undefined,
      userId: req.userId,
    });

    const comment = await service.createComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid comment data', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }

    const updateData = UpdateCommentDto.parse(req.body);

    const comment = await service.updateComment(id, updateData, req.userId);
    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid comment data', errors: error });
      return;
    }
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Comment not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }

    await service.deleteComment(id, req.userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Comment not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
