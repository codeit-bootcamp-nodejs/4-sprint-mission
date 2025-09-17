import prisma from '@lib/prisma.js';
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

class ProductRepository {
  async findOwnerById({ productId }: ProductId) {
    return await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { userId: true },
    });
  }
  async create({ userId, name, description, price, tags }: CreateDTO) {
    return await prisma.product.create({
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
    return await prisma.product.findUniqueOrThrow({
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
    return await prisma.product.findMany({
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
    return await prisma.product.update({
      where: { id: productId },
      data,
    });
  }
  async delete({ productId }: DeleteDTO) {
    return await prisma.product.delete({
      where: { id: productId },
    });
  }
  async like({ userId, productId }: LikeDTO) {
    return await prisma.productLike.create({
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
    return await prisma.productLike.delete({
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

export default new ProductRepository();
