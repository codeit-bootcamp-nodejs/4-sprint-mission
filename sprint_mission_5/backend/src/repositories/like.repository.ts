import { PrismaClient } from '@prisma/client';
import { CreateLikeDto, LikeResponseDto } from '../dto/index.js';

export class LikeRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateLikeDto): Promise<LikeResponseDto> {
    return await this.prisma.like.create({
      data,
    });
  }

  async findByUserAndProduct(
    userId: number,
    productId: number,
  ): Promise<LikeResponseDto | null> {
    return await this.prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findByUserAndArticle(
    userId: number,
    articleId: number,
  ): Promise<LikeResponseDto | null> {
    return await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async deleteByUserAndProduct(
    userId: number,
    productId: number,
  ): Promise<void> {
    await this.prisma.like.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async deleteByUserAndArticle(
    userId: number,
    articleId: number,
  ): Promise<void> {
    await this.prisma.like.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async checkProductLike(userId: number, productId: number): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!like;
  }

  async checkArticleLike(userId: number, articleId: number): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return !!like;
  }

  async checkMultipleProductLikes(
    userId: number,
    productIds: number[],
  ): Promise<Record<number, boolean>> {
    const likes = await this.prisma.like.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: { productId: true },
    });

    const likeMap: Record<number, boolean> = {};
    productIds.forEach((id) => {
      likeMap[id] = false;
    });
    likes.forEach((like) => {
      if (like.productId) {
        likeMap[like.productId] = true;
      }
    });

    return likeMap;
  }

  async checkMultipleArticleLikes(
    userId: number,
    articleIds: number[],
  ): Promise<Record<number, boolean>> {
    const likes = await this.prisma.like.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
      select: { articleId: true },
    });

    const likeMap: Record<number, boolean> = {};
    articleIds.forEach((id) => {
      likeMap[id] = false;
    });
    likes.forEach((like) => {
      if (like.articleId) {
        likeMap[like.articleId] = true;
      }
    });

    return likeMap;
  }
}
