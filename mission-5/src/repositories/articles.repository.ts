import type {
  CreateDTO,
  DeleteDTO,
  FindByIdDTO,
  FindManyDTO,
  LikeDTO,
  UnlikeDTO,
  UpdateDTO,
} from '@/dto/articles.dto.js';
import type { ArticleId } from '@/types/article.types.js';
import type { PrismaClient } from '@prisma/client';

export class ArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOwnerById({ articleId }: ArticleId) {
    return await this.prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { userId: true },
    });
  }
  async create({ title, userId, content }: CreateDTO) {
    return await this.prisma.article.create({
      data: {
        title,
        userId,
        content,
      },
    });
  }
  async findById({ articleId, userId }: FindByIdDTO) {
    return await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
  }
  async findMany({ keyword, page, pageSize, userId }: FindManyDTO) {
    return await this.prisma.article.findMany({
      where: {
        OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
  async update({ articleId, data }: UpdateDTO) {
    return await this.prisma.article.update({
      where: { id: articleId },
      data,
    });
  }
  async delete({ articleId }: DeleteDTO) {
    return await this.prisma.article.delete({
      where: { id: articleId },
    });
  }
  async like({ userId, articleId }: LikeDTO) {
    return await this.prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
      select: {
        article: true,
      },
    });
  }
  async unlike({ userId, articleId }: UnlikeDTO) {
    return await this.prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
      select: {
        article: true,
      },
    });
  }
}
