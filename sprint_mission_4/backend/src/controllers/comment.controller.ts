// src/controllers/comment.controller.js
import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client.js';
import { CreateCommentRequest, UpdateCommentRequest } from '../types/index.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
  };
}

export const createProductComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('createProductComment called');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    
    if (!req.user || !req.user.id) {
      console.log('User not found in request');
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const { content } = req.body;
    const productId = parseInt((req.params as any).productId);
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        productId: productId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error in createProductComment:', err);
    next(err);
  }
};

export const createArticleComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const { content } = req.body;
    const articleId = parseInt((req.params as any).articleId);
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        articleId: articleId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getProductComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cursor, limit = 10 } = req.query;
    const productId = parseInt((req.params as any).productId);
    const comments = await prisma.comment.findMany({
      where: { productId: productId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor as string) } }),
      select: { 
        id: true, 
        content: true, 
        createdAt: true, 
        userId: true,
        user: {
          select: {
            nickname: true
          }
        }
      },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const getArticleComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cursor, limit = 10 } = req.query;
    const articleId = parseInt((req.params as any).articleId);
    const comments = await prisma.comment.findMany({
      where: { articleId: articleId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor as string) } }),
      select: { 
        id: true, 
        content: true, 
        createdAt: true, 
        userId: true,
        user: {
          select: {
            nickname: true
          }
        }
      },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const commentId = parseInt((req.params as any).id);
    
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    });

    if (!existingComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (existingComment.userId !== req.user.id) {
      res.status(403).json({ error: '댓글을 수정할 권한이 없습니다.' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: req.body,
    });
    res.json(updated);
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    next(err);
  }
};

export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const commentId = parseInt((req.params as any).id);
    
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    });

    if (!existingComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (existingComment.userId !== req.user.id) {
      res.status(403).json({ error: '댓글을 삭제할 권한이 없습니다.' });
      return;
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    next(err);
  }
};
