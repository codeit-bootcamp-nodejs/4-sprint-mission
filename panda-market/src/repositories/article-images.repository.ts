import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { PrismaClient } from '@prisma/client';
import { CreateArticleImages } from '@/dto/article-images.dto.js';
import { ArticleIdWithTx } from '@/dto/articles.dto.js';

@injectable()
export class ArticleImageRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async createMany({ imageData, tx }: CreateArticleImages) {
    const db = tx || this.prisma;
    return await db.articleImage.createMany({
      data: imageData,
    });
  }
  async findMany({ articleId, tx }: ArticleIdWithTx) {
    const db = tx || this.prisma;
    return await db.articleImage.findMany({
      where: {
        articleId,
      },
    });
  }
  async deleteMany({ articleId, tx }: ArticleIdWithTx) {
    const db = tx || this.prisma;
    return await db.articleImage.deleteMany({
      where: {
        articleId,
      },
    });
  }
}
