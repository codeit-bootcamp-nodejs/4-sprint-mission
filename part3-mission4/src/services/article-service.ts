import { Prisma } from '@prisma/client';
import { articleRepository } from '../repositories/article-repository.js';
import type { ArticleQuery } from '../types/article-types.js';
import AppError from '../lib/appError.js';

class ArticleService {
  // 전체 게시글 조회
  async getAllArticles(query: ArticleQuery, userId?: number) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const sort = query.sort || 'recent';
    const search = query.keyword || '';

    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      sort === 'old' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const where: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const articles = await articleRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        user: { select: { username: true } },
        likedBy: { select: { id: true, username: true } },
        comments: {
          include: { likedBy: true, user: { select: { username: true } } },
        },
      },
    });

    if (!articles || articles.length === 0) {
      throw new AppError('해당하는 게시글을 찾을 수 없습니다.', 404);
    }

    const articlesWithLike = articles.map((a) => ({
      ...a,
      isLiked: userId ? (a.likedBy?.length ?? 0) > 0 : false,
    }));

    const totalArticles = await articleRepository.count(where);
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      data: articlesWithLike,
      pagination: { totalArticles, totalPages, currentPage: page, limit },
    };
  }

  // 단일 게시글 조회
  async getArticleById(articleId: number, userId?: number) {
    const article = await articleRepository.findUnique(articleId, userId);

    if (!article) throw new AppError('존재하지 않는 게시글입니다.', 404);

    const articleWhithLike = {
      ...article,
      isLiked: article.userId ? article.likedBy.length > 0 : false,
      comments: article.comments?.map((c) => ({
        ...c,
        isLiked: c.likedBy ? (c.likedBy.length ?? 0) > 0 : false,
      })),
    };

    return articleWhithLike;
  }

  // 게시글 작성
  async createArticle(title: string, content: string, userId: number) {
    if (!userId) throw new AppError('작성자를 확인할 수 없습니다.', 400);

    const newArticle = await articleRepository.create({
      title,
      content,
      userId,
    });
    if (!newArticle) throw new AppError('게시글 등록에 실패했습니다.', 400);

    return newArticle;
  }

  // 게시글 수정
  async updateArticle(
    articleId: number,
    userId: number,
    updateData: Record<string, any>
  ) {
    const product = await articleRepository.findUnique(articleId);
    if (!product) throw new AppError('제품 없음', 404);
    if (product.userId !== userId) throw new AppError('권한 없음', 403);

    await articleRepository.update(articleId, userId, updateData);

    return { message: '게시글이 수정되었습니다.' };
  }

  // 게시글 삭제
  async deleteArticle(articleId: number, userId: number) {
    const deleted = await articleRepository.delete(articleId, userId);
    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 게시글이 존재하지 않습니다.', 403);
    }
    return { message: '게시글이 삭제되었습니다.' };
  }

  // 본인이 작성한 게시글 조회
  async getUserArticles(userId: number) {
    return articleRepository.findUserArticles(userId);
  }

  // 좋아요한 게시글 조회
  async getUserLikedArticles(userId: number) {
    return articleRepository.findLikedArticles(userId);
  }

  // 게시글 좋아요
  async articleLike(userId: number, articleId: number) {
    return articleRepository.likeArticle(userId, articleId);
  }

  // 게시글 좋아요 취소
  async articleUnlike(userId: number, articleId: number) {
    return articleRepository.unlikeArticle(userId, articleId);
  }
}

export const articleService = new ArticleService();
