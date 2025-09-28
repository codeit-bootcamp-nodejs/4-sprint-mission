import type {
  CreateDTO,
  DeleteDTO,
  FindByIdDTO,
  FindManyDTO,
  LikeDTO,
  UnlikeDTO,
  UpdateDTO,
} from '@/dto/products.dto.js';
import type { ProductId } from '@/types/product.types.js';
import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class ProductRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  async findOwnerById({ productId }: ProductId) {
    return await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { userId: true },
    });
  }
  async create({ userId, name, description, price, tags }: CreateDTO) {
    return await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        userId,
      },
    });
  }
  async findById({ productId, userId }: FindByIdDTO) {
    return await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
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
  async findMany({ keyword, page, pageSize, userId }: FindManyDTO) {
    return await this.prisma.product.findMany({
      where: {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        likes: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async update({ productId, data }: UpdateDTO) {
    return await this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }
  async delete({ productId }: DeleteDTO) {
    return await this.prisma.product.delete({
      where: { id: productId },
    });
  }
  async like({ userId, productId }: LikeDTO) {
    return await this.prisma.productLike.create({
      data: {
        userId,
        productId,
      },
      select: {
        product: true,
      },
    });
  }
  async unlike({ userId, productId }: UnlikeDTO) {
    return await this.prisma.productLike.delete({
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
