import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/service.container.js';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleQueryDto,
} from '../dto/index.js';
import { AuthRequest } from '../types/auth.js';

interface AuthRequestExtended extends Request, AuthRequest {}

export const createArticle = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const { title, content }: CreateArticleDto = req.body;

    if (!title || !content) {
      res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
      return;
    }

    const articleService = serviceContainer.getArticleService();
    const article = await articleService.createArticle({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

export const getAllArticles = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(
      1,
      parseInt((req.query['page'] as string) ?? '1', 10) || 1,
    );
    const pageSize = Math.min(
      50,
      Math.max(
        1,
        parseInt((req.query['pageSize'] as string) ?? '10', 10) || 10,
      ),
    );
    const orderBy = req.query['orderBy'] as 'recent' | 'like' | undefined;
    const keyword = ((req.query['keyword'] as string) || '').trim();

    const query: ArticleQueryDto = {
      page,
      pageSize,
      ...(orderBy && { orderBy }),
      ...(keyword && { keyword }),
    };

    const articleService = serviceContainer.getArticleService();
    const result = await articleService.getArticles(query, req.user?.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params['id']!, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    const articleService = serviceContainer.getArticleService();
    const article = await articleService.getArticleById(id, req.user?.id);

    if (!article) {
      res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (
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
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    const updateData: UpdateArticleDto = req.body;
    const articleService = serviceContainer.getArticleService();
    const updatedArticle = await articleService.updateArticle(
      id,
      updateData,
      req.user.id,
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 게시글을 수정할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteArticle = async (
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
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    const articleService = serviceContainer.getArticleService();
    await articleService.deleteArticle(id, req.user.id);

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === '해당 게시글을 삭제할 권한이 없습니다.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const toggleArticleLike = async (
  req: AuthRequestExtended,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const articleId = parseInt(req.params['id']!, 10);

    if (isNaN(articleId)) {
      res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      return;
    }

    const articleService = serviceContainer.getArticleService();
    const result = await articleService.toggleLike(articleId, req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
