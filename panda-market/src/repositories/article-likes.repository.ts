import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { AuthArticleParams } from '@/dto/articles.dto.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ArticleLikeRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async findById({ userId, articleId, tx }: AuthArticleParams) {
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
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.articleLike.findMany({
      where: { userId },
    });
  }
  async create({ userId, articleId, tx }: AuthArticleParams) {
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
  async delete({ userId, articleId, tx }: AuthArticleParams) {
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
