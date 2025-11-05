import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ArticleParams } from '@/dto/articles.dto.js';

@injectable()
export class ArticleLikeRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async findById({ userId, articleId, tx }: ArticleParams) {
    const db = tx || this.prisma;
    return await db.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
  async create({ userId, articleId, tx }: ArticleParams) {
    const db = tx || this.prisma;
    return await db.articleLike.create({
      data: {
        userId,
        articleId,
      },
      select: {
        article: true,
      },
    });
  }
  async delete({ userId, articleId, tx }: ArticleParams) {
    const db = tx || this.prisma;
    return await db.articleLike.delete({
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
