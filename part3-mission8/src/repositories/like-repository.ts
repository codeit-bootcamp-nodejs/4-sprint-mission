import { prisma } from '../lib/prismaClient.js';

/**
 * 공통적으로 쓰는 유틸 타입
 */
type ArticleLikeGroupByResult = {
  articleId: number;
  _count: { articleId: number };
};

type ProductLikeGroupByResult = {
  productId: number;
  _count: { productId: number };
};

type CommentLikeGroupByResult = {
  commentId: number;
  _count: { commentId: number };
};

type ArticleUserLikeResult = { articleId: number };
type ProductUserLikeResult = { productId: number };
type CommentUserLikeResult = { commentId: number };

/**
 * ArticleLike 전용 리포지토리
 */
export class ArticleLikeRepository {
  async create(userId: number, articleId: number) {
    return prisma.articleLike.create({
      data: { userId, articleId },
    });
  }

  async delete(userId: number, articleId: number) {
    return prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async count(articleId: number) {
    return prisma.articleLike.count({
      where: { articleId },
    });
  }

  async exists(userId: number, articleId: number): Promise<boolean> {
    const record = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return !!record;
  }

  async countByTargetIds(
    articleIds: number[]
  ): Promise<ArticleLikeGroupByResult[]> {
    const rows = await prisma.articleLike.groupBy({
      by: ['articleId'],
      _count: { articleId: true },
      where: { articleId: { in: articleIds } },
    });
    return rows;
  }

  async findByUserAndTargetIds(
    userId: number,
    articleIds: number[]
  ): Promise<ArticleUserLikeResult[]> {
    const rows = await prisma.articleLike.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
      select: {
        articleId: true,
      },
    });
    return rows;
  }
}

/**
 * ProductLike 전용 리포지토리
 */
export class ProductLikeRepository {
  async create(userId: number, productId: number) {
    return prisma.productLike.create({
      data: { userId, productId },
    });
  }

  async delete(userId: number, productId: number) {
    return prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async count(productId: number) {
    return prisma.productLike.count({
      where: { productId },
    });
  }

  async exists(userId: number, productId: number): Promise<boolean> {
    const record = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!record;
  }

  async countByTargetIds(
    productIds: number[]
  ): Promise<ProductLikeGroupByResult[]> {
    const rows = await prisma.productLike.groupBy({
      by: ['productId'],
      _count: { productId: true },
      where: { productId: { in: productIds } },
    });

    return rows;
  }

  async findByUserAndTargetIds(
    userId: number,
    productIds: number[]
  ): Promise<ProductUserLikeResult[]> {
    const rows = await prisma.productLike.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: {
        productId: true,
      },
    });

    return rows;
  }

  /**
   * 도메인 특화: 이 상품을 좋아요 누른 유저 목록
   */
  async findUsersWhoLikedProduct(productId: number) {
    const likes = await prisma.productLike.findMany({
      where: { productId },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // likes: { user: { id, username, email } }[]
    return likes.map((like) => like.user);
  }
}

/**
 * CommentLike 전용 리포지토리
 */
export class CommentLikeRepository {
  async create(userId: number, commentId: number) {
    return prisma.commentLike.create({
      data: { userId, commentId },
    });
  }

  async delete(userId: number, commentId: number) {
    return prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }

  async count(commentId: number) {
    return prisma.commentLike.count({
      where: { commentId },
    });
  }

  async exists(userId: number, commentId: number): Promise<boolean> {
    const record = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
    return !!record;
  }

  async countByTargetIds(
    commentIds: number[]
  ): Promise<CommentLikeGroupByResult[]> {
    const rows = await prisma.commentLike.groupBy({
      by: ['commentId'],
      _count: { commentId: true },
      where: { commentId: { in: commentIds } },
    });

    return rows;
  }

  async findByUserAndTargetIds(
    userId: number,
    commentIds: number[]
  ): Promise<CommentUserLikeResult[]> {
    const rows = await prisma.commentLike.findMany({
      where: {
        userId,
        commentId: { in: commentIds },
      },
      select: {
        commentId: true,
      },
    });

    return rows;
  }
}

/**
 * 실제 export해서 쓰는 인스턴스들
 */
export const articleLikeRepository = new ArticleLikeRepository();
export const productLikeRepository = new ProductLikeRepository();
export const commentLikeRepository = new CommentLikeRepository();
