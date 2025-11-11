import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ArticleLikeRepository } from '@/repositories/article-likes.repository.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { ArticleParams } from '@/dto/articles.dto.js';
import { NotFoundError } from '@/lib/errors.js';
import { ArticleRepository } from '@/repositories/articles.repository.js';

@injectable()
export class ArticleLikeService {
  constructor(
    @inject(TYPES.ArticleLikeRepository)
    private readonly articleLikeRepository: ArticleLikeRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
    @inject(TYPES.ArticleRepository)
    private readonly articleRepository: ArticleRepository,
  ) {}
  async postArticleLike({ userId, articleId }: ArticleParams) {
    return await this.prisma.$transaction(async (tx) => {
      const existingLike = await this.articleLikeRepository.findById({
        userId,
        articleId,
        tx,
      });
      if (!existingLike) {
        await this.articleLikeRepository.create({
          userId,
          articleId,
          tx,
        });
        const patchData: Prisma.ArticleUpdateInput = {
          likeCount: {
            increment: 1,
          },
        };
        await this.articleRepository.update({
          articleId,
          patchData,
          tx,
        });
      }
      return this.articleRepository.findById({ articleId, userId, tx });
    });
  }

  async deleteArticleLike({ userId, articleId }: ArticleParams) {
    return await this.prisma.$transaction(async (tx) => {
      const deleteLike = await this.articleLikeRepository.delete({
        userId,
        articleId,
        tx,
      });
      if (!deleteLike) {
        throw new NotFoundError('이미 좋아요 취소된 상품입니다.');
      }
      const patchData: Prisma.ArticleUpdateInput = {
        likeCount: {
          decrement: 1,
        },
      };
      await this.articleRepository.update({
        articleId,
        patchData,
        tx,
      });
      return this.articleRepository.findById({ articleId, userId, tx });
    });
  }
}
