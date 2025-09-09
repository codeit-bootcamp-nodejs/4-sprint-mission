import { prisma } from '../lib/prismaClient.js';
import AppError from '../lib/appError.js';
import { Prisma } from '@prisma/client';
import { appendFile } from 'fs';

console.log('[Service] Imported prisma:', !!prisma);

type ArticleQuery = {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'old';
  keyword?: string;
};

type Article = Awaited<ReturnType<typeof prisma.article.findMany>>[number];

class ArticleService {
  // 전체 게시글 조회
  async getAllArticles(query: ArticleQuery, userId?: number) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sort = query.sort || 'recent';
    const skip = (page - 1) * limit;

    const search = query.keyword || '';

    let orderBy;
    switch (sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'old':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const where: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              content: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true } },
        likedBy: true,
        comments: true,
      },
    });

    if (!articles || articles.length === 0) {
      throw new AppError('해당하는 게시글을 찾을 수 없습니다.', 404);
    }

    // ✅ 여기서 a의 타입을 Prisma가 반환한 타입으로 추론
    const articlesWithLike = articles.map((a) => ({
      ...a,
      isLiked: userId ? a.likedBy?.length > 0 : false,
      likeCount: a.likeCount,
    }));

    const totalArticles = await prisma.article.count({ where });
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      data: articlesWithLike,
      pagination: { totalArticles, totalPages, currentPage: page, limit },
    };
  }

  // 단일 게시글 조회
  async getArticleById(articleId: number, userId?: number) {
    const include = {
      user: { select: { username: true } },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { username: true } },
          likeCount: true,
          ...(userId && {
            likedBy: {
              where: { id: userId },
              select: { id: true, username: true },
            },
          }),
        },
      },
      ...(userId && {
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      }),
    };

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include,
    });

    if (!article) {
      throw new AppError('존재하지 않는 게시글입니다.', 404);
    }

    const articleWithLike = {
      ...article,
      isLiked: article.likedBy?.length > 0 || false,
      likeCount: article.likeCount,
      comments: article.comments.map((c) => ({
        ...c,
        isLiked: c.likedBy?.length > 0 || false,
      })),
    };

    return articleWithLike;
  }

  // 게시글 작성
  async createArticle(title: string, content: string, userId: number) {
    if (!userId) throw new AppError('작성자를 확인할 수 없습니다.', 400);

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        user: { connect: { id: userId } },
      },
    });

    if (!newArticle) {
      throw new AppError('게시글 등록에 실패했습니다.', 400);
    }
    return newArticle;
  }

  // 게시글 수정
  async updateArticle(
    id: number,
    updateData: Record<string, any>,
    userId: number
  ) {
    const updated = await prisma.article.update({
      where: { id: id, userId },
      data: updateData,
    });
    return { message: '게시글이 수정되었습니다.' };
  }

  // 게시글 삭제
  async deleteArticle(id: number, userId: number) {
    const deleted = await prisma.article.deleteMany({
      where: { id: id, userId },
    });

    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 게시글이 존재하지 않습니다.', 403);
    }

    return { message: '게시글이 삭제되었습니다.' };
  }

  // 본인이 작성한 게시글 조회
  async getUserArticles(userId: number) {
    const articles = await prisma.article.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        images: true,
        likeCount: true,
      },
    });
    return articles;
  }

  // 좋아요한 게시글 조회
  async getUserLikedArticles(userId: number) {
    const likedArticles = await prisma.article.findMany({
      where: { likedBy: { some: { id: userId } } },
    });
    return likedArticles;
  }

  // 게시글 좋아요
  async articleLike(userId: number, articleId: number) {
    const articleLiked = await prisma.article.update({
      where: { id: articleId },
      data: {
        likedBy: { connect: { id: userId } },
        likeCount: { increment: 1 },
      },
    });
    return articleLiked;
  }

  // 게시글 좋아요 취소
  async articleUnlike(userId: number, articleId: number) {
    const articleUnliked = await prisma.article.update({
      where: { id: articleId },
      data: {
        likedBy: { disconnect: { id: userId } },
        likeCount: { decrement: 1 },
      },
    });
    return articleUnliked;
  }
}

export const articleService = new ArticleService();
