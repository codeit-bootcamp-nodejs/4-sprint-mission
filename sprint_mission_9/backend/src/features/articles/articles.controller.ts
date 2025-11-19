import { Response } from 'express';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, GetArticlesQueryDto } from './articles.dto';
import prisma from '../../shared/database/prisma.client';

const repository = new ArticlesRepository(prisma);
const service = new ArticlesService(repository);

export const getArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = GetArticlesQueryDto.parse({
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      orderBy: req.query.orderBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
      search: req.query.search as string | undefined,
    });

    const result = await service.getArticles(query);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid query parameters', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
};

export const getArticleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }

    const article = await service.getArticleById(id);
    res.status(200).json(article);
  } catch (error) {
    if (error instanceof Error && error.message === 'Article not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to fetch article' });
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const articleData = CreateArticleDto.parse({
      ...req.body,
      userId: req.userId,
    });

    const article = await service.createArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid article data', errors: error });
      return;
    }
    res.status(500).json({ message: 'Failed to create article' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }

    const updateData = UpdateArticleDto.parse(req.body);

    const article = await service.updateArticle(id, updateData, req.userId);
    res.status(200).json(article);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      res.status(400).json({ message: 'Invalid article data', errors: error });
      return;
    }
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Article not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to update article' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }

    await service.deleteArticle(id, req.userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      res.status(403).json({ message: error.message });
      return;
    }
    if (error instanceof Error && error.message === 'Article not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to delete article' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }

    const result = await service.toggleLike(id, req.userId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Article not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};
