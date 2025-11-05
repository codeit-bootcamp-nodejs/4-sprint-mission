import type {
  ArticleIdWithTx,
  ArticleParams,
  CreateDTO,
  UpdateDTO,
} from '@/dto/articles.dto.js';
import type { ArticleId } from '@/types/article.types.js';
import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { GetListParams } from '../types/shared.type.js';

@injectable()
export class ArticleRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findOwnerById({ articleId }: ArticleId) {
    return await this.prisma.article.findUniqueOrThrow({
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
      },
    });
  }
  async findMany({ keyword, page, pageSize, userId }: GetListParams) {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
  async create({ tx, createData: data }: CreateDTO) {
    const db = tx || this.prisma;
    return await db.article.create({
      data: data,
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
