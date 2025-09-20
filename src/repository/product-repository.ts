import { PrismaClient } from '@prisma/client';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  createProduct = async (
    userId: number,
    name: string,
    description: string,
    price: number,
    tags: string[],
  ) => {
    return await this.prisma.product.create({
      data: { userId, name, description, price, tags },
    });
  };

  findManyProducts = async (
    whereCondition: any,
    offset: number,
    limit: number,
    userId: number | undefined,
  ) => {
    const products = await this.prisma.product.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    if (userId && products.length > 0) {
      const productIds = products.map((p) => p.id);
      const likes = await this.prisma.productLike.findMany({
        where: { userId, productId: { in: productIds } },
        select: { productId: true },
      });
      const likedProductIds = new Set(likes.map((like) => like.productId));
      (products as any[]).forEach((product) => {
        product.isLiked = likedProductIds.has(product.id);
      });
    }

    return products;
  };

  countProducts = async (whereCondition: any, tx?: any) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.product.count({ where: whereCondition });
  };

  findProductById = async (
    productId: string,
    userId?: number | undefined,
  ) => {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        _count: { select: { likes: true } },
      },
    });

    if (product && userId) {
      const like = await this.prisma.productLike.findUnique({
        where: {
          userId_productId: { userId, productId: parseInt(productId) },
        },
      });
      (product as any).isLiked = !!like;
    }
    return product;
  };

  updateProduct = async (productId: string, dataToUpdate: any) => {
    return await this.prisma.product.update({
      where: { id: parseInt(productId) },
      data: dataToUpdate,
    });
  };

  deleteProduct = async (productId: string) => {
    await this.prisma.product.delete({
      where: { id: parseInt(productId) },
    });
  };

  findProductsByUserId = async (userId: number) => {
    return await this.prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
  };
}