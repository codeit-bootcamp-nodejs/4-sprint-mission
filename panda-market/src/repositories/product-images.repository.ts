import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { PrismaClient } from '@prisma/client';
import { CreateProductImages } from '@/dto/product-images.dto.js';
import { ProductIdWithTx } from '@/dto/products.dto.js';

@injectable()
export class ProductImageRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async createMany({ imageData, tx }: CreateProductImages) {
    const db = tx || this.prisma;
    return await db.productImage.createMany({
      data: imageData,
    });
  }
  async findMany({ productId, tx }: ProductIdWithTx) {
    const db = tx || this.prisma;
    return await db.productImage.findMany({
      where: {
        productId,
      },
      select: {
        publicId: true,
        url: true,
      },
    });
  }
}
