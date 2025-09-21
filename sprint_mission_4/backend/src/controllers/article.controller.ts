import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client.js';
import { CreateArticleRequest, UpdateArticleRequest } from '../types/index.js';
import { AuthRequest } from '../types/auth.js';
import { ArticleWithCounts, ArticleWithLikeStatus } from '../types/article.js';

interface AuthRequestExtended extends Request, AuthRequest {}

// Article 생성 API
export const createArticle = async (req: AuthRequestExtended & Request<{}, {}, CreateArticleRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { 
        title, 
        content,
        userId: req.user!.id
      },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

// Article 목록 조회 API
export const getAllArticles = async (req: AuthRequestExtended, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offset = Math.max(0, parseInt((req.query['offset'] as string) ?? '0', 10) || 0);
    const limitRaw = parseInt((req.query['limit'] as string) ?? '10', 10);
    const limit = Math.min(50, Math.max(1, limitRaw || 10)); // 1~50 범위
    const search = ((req.query['search'] as string) ?? '').trim();
    const sort = req.query['sort'] as string;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const orderBy = sort === 'recent' ? { createdAt: 'desc' as const } : undefined;

    const findManyParams = {
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      ...(where && { where }),
      ...(orderBy && { orderBy })
    };
    
    const articles = await prisma.article.findMany(findManyParams) as ArticleWithCounts[];

    const userLikes = req.user
      ? await prisma.like.findMany({
          where: {
            userId: req.user.id,
            articleId: { in: articles.map(a => a.id) }
          }
        })
      : [];

    const likedArticleIds = new Set(userLikes.map(like => like.articleId));

    const articlesWithLikeStatus: ArticleWithLikeStatus[] = articles.map(article => ({
      ...article,
      likeCount: article._count.likes,
      commentCount: article._count.comments,
      isLiked: likedArticleIds.has(article.id),
    }));

    res.json(articlesWithLikeStatus);
  } catch (err) {
    next(err);
  }
};

// Article 상세 조회 API
export const getArticleById = async (req: AuthRequestExtended & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const article = await prisma.article.findUnique({
      where: { id },
      select: { 
        id: true, 
        title: true, 
        content: true, 
        createdAt: true,
        userId: true,
        user: {
          select: {
            nickname: true
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      },
    });
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const isLiked = req.user
      ? await prisma.like.findFirst({
          where: { userId: req.user.id, articleId: article.id }
        })
      : null;

    const articleWithCounts = article as ArticleWithCounts;
    res.json({
      ...articleWithCounts,
      likeCount: articleWithCounts._count.likes,
      commentCount: articleWithCounts._count.comments,
      isLiked: !!isLiked,
    });
  } catch (err) {
    next(err);
  }
};

// Article 수정 API
export const updateArticle = async (req: AuthRequestExtended & Request<{ id: string }, {}, UpdateArticleRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }

    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingArticle) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    if (existingArticle.userId !== req.user!.id) {
      res.status(403).json({ error: '게시글을 수정할 권한이 없습니다.' });
      return;
    }

    const { title, content } = req.body;
    const data: Partial<{ title: string; content: string }> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    const updated = await prisma.article.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Article 삭제 API
export const deleteArticle = async (req: AuthRequestExtended & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingArticle) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    if (existingArticle.userId !== req.user!.id) {
      res.status(403).json({ error: '게시글을 삭제할 권한이 없습니다.' });
      return;
    }

    await prisma.article.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    next(err);
  }
};

// Article 좋아요 토글 API
export const toggleArticleLike = async (req: AuthRequestExtended & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user!.id;

    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, articleId }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ message: '좋아요가 취소되었습니다.', isLiked: false });
    } else {
      await prisma.like.create({
        data: { userId, articleId }
      });
      res.json({ message: '좋아요가 추가되었습니다.', isLiked: true });
    }
  } catch (err) {
    next(err);
  }
};
