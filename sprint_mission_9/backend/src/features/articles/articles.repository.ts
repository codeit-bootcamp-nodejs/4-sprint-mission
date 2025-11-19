import { PrismaClient, Prisma } from '@prisma/client';
import { ArticleFilter, PaginationParams } from '../../shared/types/models';
import { CreateArticleInput, UpdateArticleInput } from './articles.dto';

export class ArticlesRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateArticleInput) {
    return this.prisma.article.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
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
  }

  async findById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
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
  }

  async findMany(filter: ArticleFilter & PaginationParams) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      search,
    } = filter;

    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      ...(userId && { userId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              image: true,
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

    return {
      data: articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateArticleInput) {
    return this.prisma.article.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            image: true,
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
  }

  async delete(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  async isOwner(articleId: number, userId: number): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });
    return article?.userId === userId;
  }

  // Like operations
  async checkLike(userId: number, articleId: number): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        userId,
        articleId,
      },
    });
    return like !== null;
  }

  async addLike(userId: number, articleId: number): Promise<void> {
    await this.prisma.like.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  async removeLike(userId: number, articleId: number): Promise<void> {
    await this.prisma.like.deleteMany({
      where: {
        userId,
        articleId,
      },
    });
  }
}
