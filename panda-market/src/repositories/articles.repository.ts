import type {
  ArticleIdWithTx,
  ArticleParams,
  CreateDTO,
  UpdateDTO,
} from '@/dto/articles.dto.js';
import type { ArticleId } from '@/types/article.types.js';
import type { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { GetListParams } from '@/types/shared.types.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ArticleRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findOwnerById({ articleId }: ArticleId) {
    return await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });
  }
  async findById({ articleId, userId, tx }: ArticleParams) {
    const db = tx || this.prisma;
    return await db.article.findUniqueOrThrow({
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
    });
  }
  async findMany({ keyword, page, pageSize, orderBy, userId }: GetListParams) {
    let orderOption: Prisma.ProductOrderByWithRelationInput;
    if (orderBy === 'like') {
      orderOption = {
        likeCount: 'desc',
      };
    } else {
      orderOption = {
        createdAt: 'desc',
      };
    }
    return await this.prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderOption,
    });
  }
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.article.findMany({
      where: { userId },
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async create({ tx, createData: data }: CreateDTO) {
    const db = tx || this.prisma;
    return await db.article.create({
      data: data,
      select: {
        id: true,
        title: true,
        content: true,
        likeCount: true,
        userId: true,
        createdAt: true,
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
    });
  }
  async update({ tx, articleId, patchData: data }: UpdateDTO) {
    const db = tx || this.prisma;
    return await db.article.update({
      where: { id: articleId },
      data,
    });
  }
  async delete({ articleId, tx }: ArticleIdWithTx) {
    const db = tx || this.prisma;
    return await db.article.delete({
      where: { id: articleId },
    });
  }
}
