import { PrismaClient } from '@prisma/client';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
  ArticleWithCountsDto,
  ArticleQueryDto,
} from '../dto/index.js';

export class ArticleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateArticleDto): Promise<ArticleResponseDto> {
    return await this.prisma.article.create({
      data,
    });
  }

  async findById(id: number): Promise<ArticleResponseDto | null> {
    return await this.prisma.article.findUnique({
      where: { id },
    });
  }

  async findByIdWithCounts(id: number): Promise<ArticleWithCountsDto | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!article) return null;

    const { _count, ...articleData } = article;
    return {
      ...articleData,
      likeCount: _count.likes,
      commentCount: _count.comments,
    };
  }

  async findMany(query: ArticleQueryDto): Promise<{
    articles: ArticleWithCountsDto[];
    totalCount: number;
  }> {
    const { page = 1, pageSize = 10, orderBy = 'recent', keyword } = query;
    const skip = (page - 1) * pageSize;

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' as const } },
            { content: { contains: keyword, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const orderByClause =
      orderBy === 'like'
        ? { likes: { _count: 'desc' as const } }
        : { createdAt: 'desc' as const };

    const [articles, totalCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: orderByClause,
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    const articlesWithCounts = articles.map((article) => {
      const { _count, ...articleData } = article;
      return {
        ...articleData,
        likeCount: _count.likes,
        commentCount: _count.comments,
      };
    });

    return {
      articles: articlesWithCounts,
      totalCount,
    };
  }

  async update(
    id: number,
    data: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    return await this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }

  async checkOwnership(id: number, userId: number): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { userId: true },
    });
    return article?.userId === userId;
  }

  async findByUserId(userId: number): Promise<{ list: ArticleResponseDto[]; totalCount: number }> {
    const articles = await this.prisma.article.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const articlesWithCounts = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        likeCount: await this.prisma.like.count({
          where: { articleId: article.id },
        }),
        commentCount: await this.prisma.comment.count({
          where: { articleId: article.id },
        }),
        isLiked: false, // 자신의 게시글이므로 기본적으로 false
      })),
    );

    return {
      list: articlesWithCounts,
      totalCount: articles.length,
    };
  }
}
