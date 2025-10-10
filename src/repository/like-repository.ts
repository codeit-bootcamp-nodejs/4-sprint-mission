import { PrismaClient } from '@prisma/client';

export class LikeRepository {
  constructor(private prisma: PrismaClient) {}

  findProductLike = async (userId: number, productId: number) => {
    return await this.prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  };

  createProductLike = async (userId: number, productId: number) => {
    return await this.prisma.productLike.create({
      data: { userId, productId },
    });
  };

  deleteProductLike = async (userId: number, productId: number) => {
    return await this.prisma.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
  };

  findArticleLike = async (userId: number, articleId: number) => {
    return await this.prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  };

  createArticleLike = async (userId: number, articleId: number) => {
    return await this.prisma.articleLike.create({
      data: { userId, articleId },
    });
  };

  deleteArticleLike = async (userId: number, articleId: number) => {
    return await this.prisma.articleLike.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  };
}