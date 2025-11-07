import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';

export class ProductsRepository {
  createProduct = async (data: Prisma.ProductCreateInput) => {
    return await prisma.product.create({ data });
  };

  findProducts = async () => {
    return await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  findProductById = async (productId: number) => {
    return await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  findProductByIdSimple = async (productId: number) => {
    return await prisma.product.findUnique({ where: { id: productId } });
  };

  updateProduct = async (productId: number, data: Prisma.ProductUpdateInput) => {
    return await prisma.product.update({
      where: { id: productId },
      data,
    });
  };

  deleteProduct = async (productId: number) => {
    return await prisma.product.delete({ where: { id: productId } });
  };

  findProductLike = async (userId: number, productId: number) => {
    return await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  };

  createProductLike = async (userId: number, productId: number) => {
    return await prisma.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  };

  deleteProductLike = async (userId: number, productId: number) => {
    return await prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  };

  findProductsByAuthorId = async (authorId: number) => {
    return await prisma.product.findMany({
      where: { authorId },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  findLikedProductsByUserId = async (userId: number) => {
    return await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  findProductLikesByProductId = async (productId: number) => { // New method
    return await prisma.productLike.findMany({
      where: { productId },
      select: {
        userId: true,
      },
    });
  };
}
