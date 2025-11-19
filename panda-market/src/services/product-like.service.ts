import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ProductLikeRepository } from '@/repositories/product-likes.repository.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { AuthProductParams } from '@/dto/products.dto.js';
import { NotFoundError } from '@/lib/errors.js';
import { ProductRepository } from '@/repositories/products.repository.js';

@injectable()
export class ProductLikeService {
  constructor(
    @inject(TYPES.ProductLikeRepository)
    private readonly productLikeRepository: ProductLikeRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
    @inject(TYPES.ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}
  async postProductLike({ userId, productId }: AuthProductParams) {
    return await this.prisma.$transaction(async (tx) => {
      const existingLike = await this.productLikeRepository.findById({
        userId,
        productId,
        tx,
      });
      if (!existingLike) {
        await this.productLikeRepository.create({
          userId,
          productId,
          tx,
        });
        const patchData: Prisma.ProductUpdateInput = {
          likeCount: {
            increment: 1,
          },
        };
        await this.productRepository.update({
          productId,
          patchData,
          userId,
          tx,
        });
      }
      return this.productRepository.findById({ productId, userId, tx });
    });
  }

  async deleteProductLike({ userId, productId }: AuthProductParams) {
    return await this.prisma.$transaction(async (tx) => {
      const deleteLike = await this.productLikeRepository.delete({
        userId,
        productId,
        tx,
      });
      if (!deleteLike) {
        throw new NotFoundError('이미 좋아요 취소된 상품입니다.');
      }
      const patchData: Prisma.ProductUpdateInput = {
        likeCount: {
          decrement: 1,
        },
      };
      await this.productRepository.update({
        productId,
        patchData,
        userId,
        tx,
      });
      return this.productRepository.findById({ productId, userId, tx });
    });
  }
}
