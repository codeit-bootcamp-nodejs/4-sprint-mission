import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { PrismaClient } from '@prisma/client';
import type { TagInput } from '@/dto/tags.dto.js';
import { ProductIdWithTx } from '@/dto/products.dto.js';

@injectable()
export class TagRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async findMany({ productId, tx }: ProductIdWithTx) {
    const db = tx || this.prisma;
    const tags = await db.tag.findMany({
      where: {
        products: {
          some: {
            id: productId,
          },
        },
      },
      select: {
        name: true,
      },
    });
    return tags.map((tag) => tag.name);
  }
  async incrementCounts({ tags, tx }: TagInput) {
    const db = tx || this.prisma;

    return await db.tag.updateMany({
      where: {
        name: { in: tags },
      },
      data: {
        productCount: {
          increment: 1,
        },
      },
    });
  }
  async decrementCounts({ tags, tx }: TagInput) {
    const db = tx || this.prisma;

    return await db.tag.updateMany({
      where: {
        name: { in: tags },
        productCount: { gt: 0 },
      },
      data: {
        productCount: {
          decrement: 1,
        },
      },
    });
  }
}
