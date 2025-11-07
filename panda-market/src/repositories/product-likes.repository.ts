import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ProductIdWithTx, ProductParams } from '@/dto/products.dto.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ProductLikeRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async findById({ userId, productId, tx }: ProductParams) {
    const db = tx || this.prisma;
    return await db.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
  async findManyByProductId({ productId, tx }: ProductIdWithTx) {
    const db = tx || this.prisma;
    return await db.productLike.findMany({
      where: {
        productId,
      },
    });
  }
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.productLike.findMany({
      where: { userId },
    });
  }
  async create({ userId, productId, tx }: ProductParams) {
    const db = tx || this.prisma;
    return await db.productLike.create({
      data: {
        userId,
        productId,
      },
      select: {
        product: true,
      },
    });
  }
  async delete({ userId, productId, tx }: ProductParams) {
    const db = tx || this.prisma;
    return await db.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: {
        product: true,
      },
    });
  }
}
