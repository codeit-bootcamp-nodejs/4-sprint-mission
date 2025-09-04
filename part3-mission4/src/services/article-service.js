import prisma from '../lib/prismaClient.js';
import AppError from '../lib/appError.js';

class ArticleService {
  async getAllArticles(query, userId) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const sort = query.sort || 'recent';
    const keyword = query.keyword || '';
    const skip = (page - 1) * limit;

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
    }

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const include = {
      user: { select: { username: true } },
      ...(userId && {
        likedBy: {
          where: { id: userId },
          select: { id: true, username: true },
        },
      }),
    };

    const articles = await prisma.article.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include,
    });

    if (!articles || articles.length === 0) {
      throw new AppError('해당하는 게시글을 찾을 수 없습니다.', 404);
    }

    const articlesWithLike = articles.map((a) => ({
      ...a,
      isLiked: a.likedBy?.length > 0 || false,
      likeCount: a.likeCount,
    }));

    const totalArticles = await prisma.article.count({ where });
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      data: articlesWithLike,
      pagination: { totalArticles, totalPages, currentPage: page, limit },
    };
  }

  async getArticleById(articleId, userId) {
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
      where: { id: parseInt(articleId) },
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
        likeCount: c.likeCount,
      })),
    };

    return articleWithLike;
  }

  async createArticle(title, content, userId) {
    if (!userId) throw new AppError('작성자를 확인할 수 없습니다.', 400);

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        user: { connect: { id: parseInt(userId) } },
      },
    });

    if (!newArticle) {
      throw new AppError('게시글 등록에 실패했습니다.', 400);
    }
    return newArticle;
  }

  async updateArticle(id, updateData, userId) {
    const updated = await prisma.article.updateMany({
      where: { id: parseInt(id), userId },
      data: updateData,
    });

    if (updated.count === 0) {
      throw new AppError('권한이 없거나 게시글이 존재하지 않습니다.', 403);
    }

    return { message: '게시글이 수정되었습니다.' };
  }

  async deleteArticle(id, userId) {
    const deleted = await prisma.article.deleteMany({
      where: { id: parseInt(id), userId },
    });

    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 게시글이 존재하지 않습니다.', 403);
    }

    return { message: '게시글이 삭제되었습니다.' };
  }

  // 특정 유저의 게시글 조회
  async getUserArticles(userId) {
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

  async getUserLikedArticles(userId) {
    const likedArticles = await prisma.product.findMany({
      where: { likedBy: { some: { id: parseInt(userId) } } },
    });
    return likedArticles;
  }

  async articleLike(userId, articleId) {
    const articleLiked = await prisma.product.update({
      where: { id: parseInt(articleId) },
      data: {
        likedBy: { connect: { id: parseInt(userId) } },
        likeCount: { increment: 1 },
      },
    });
    return articleLiked;
  }

  async articleUnlike(userId, articleId) {
    const articleUnliked = await prisma.product.update({
      where: { id: parseInt(articleId) },
      data: {
        likedBy: { disconnect: { id: parseInt(userId) } },
        likeCount: { decrement: 1 },
      },
    });
    return articleUnliked;
  }
}

export const articleService = new ArticleService();
