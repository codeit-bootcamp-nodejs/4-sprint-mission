import prisma from '../lib/prismaClient.js';
import AppError from '../lib/appError.js';

class ArticleService {
  async getAllArticles(query) {
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

    const articles = await prisma.article.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!articles || articles.length === 0) {
      throw new AppError('해당하는 게시글을 찾을 수 없습니다.', 404);
    }

    const totalArticles = await prisma.article.count({ where });
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      data: articles,
      pagination: { totalArticles, totalPages, currentPage: page, limit },
    };
  }

  async getArticleById(id) {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { username: true },
        },
        comments: {
          // 게시글 댓글
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              // 댓글 작성자
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (!article) {
      throw new AppError('존재하지 않는 게시글입니다.', 404);
    }
    return article;
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
      },
    });
    return articles;
  }
}

export const articleService = new ArticleService();
