import type {
  CreateDTO,
  ProductIdWithTx,
  ProductParams,
  UpdateDTO,
} from '@/dto/products.dto.js';
import type { ProductId } from '@/types/product.types.js';
import type { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { GetListParams } from '@/types/shared.types.js';
import { UserId } from '@/types/user.types.js';

@injectable()
export class ProductRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findOwnerById({ productId }: ProductId) {
    return await this.prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });
  }
  async findPriceById({ productId, tx }: ProductIdWithTx) {
    const db = tx || this.prisma;
    return await db.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
  }
  async findById({ productId, userId, tx }: ProductParams) {
    const db = tx || this.prisma;
    return await db.product.findUnique({
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
    });
  }
  async findMany({ keyword, page, pageSize, orderBy, userId }: GetListParams) {
    let orderOption: Prisma.ProductOrderByWithRelationInput;
    if (orderBy === 'like') {
      orderOption = {
        likeCount: 'desc',
      };
    } else {
      orderOption = {
        createdAt: 'desc',
      };
    }
    return await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderOption,
    });
  }
  async findManyByUserId({ userId }: UserId) {
    return await this.prisma.product.findMany({
      where: { userId },
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async create({ tx, createData: data }: CreateDTO) {
    const db = tx || this.prisma;
    return await db.product.create({
      data: data,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        likeCount: true,
        userId: true,
        createdAt: true,
        tags: true,
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
    });
  }
  async update({ productId, tx, userId, patchData: data }: UpdateDTO) {
    const db = tx || this.prisma;
    return await db.product.update({
      where: { id: productId },
      data,
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
        likeCount: true,
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        images: {
          select: {
            id: true,
            publicId: true,
            url: true,
          },
        },
      },
    });
  }
  async delete({ productId, tx }: ProductIdWithTx) {
    const db = tx || this.prisma;
    return await db.product.delete({
      where: { id: productId },
    });
  }
}
