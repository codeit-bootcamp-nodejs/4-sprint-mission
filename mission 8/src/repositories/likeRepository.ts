import prisma from "../lib/prisma";

export class LikeRepository {
  async findArticle(articleId: number) {
    return prisma.article.findUnique({ where: { id: articleId } });
  }

  async findProduct(productId: number) {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  async findArticleLike(userId: number, articleId: number) {
    return prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  async findProductLike(userId: number, productId: number) {
    return prisma.like.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  async toggleArticleLike(userId: number, articleId: number, current: boolean) {
    return prisma.like.update({
      where: { userId_articleId: { userId, articleId } },
      data: { like: !current },
    });
  }

  async toggleProductLike(userId: number, productId: number, current: boolean) {
    return prisma.like.update({
      where: { userId_productId: { userId, productId } },
      data: { like: !current },
    });
  }

  async createArticleLike(userId: number, articleId: number) {
    return prisma.like.create({
      data: { like: true, userId, articleId },
    });
  }

  async createProductLike(userId: number, productId: number) {
    return prisma.like.create({
      data: { like: true, userId, productId },
    });
  }

  async findLikedArticles(userId: number) {
    return prisma.like.findMany({
      where: { userId, articleId: { not: null }, like: true },
      include: {
        article: { select: { id: true, title: true } },
      },
    });
  }

  async findLikedProducts(userId: number) {
    return prisma.like.findMany({
      where: { userId, productId: { not: null }, like: true },
      include: {
        product: { select: { id: true, name: true, price: true, tags: true } },
      },
    });
  }

  async findUsersWhoLikedProduct(productId: number) {
    const likes = await prisma.like.findMany({
      where: {
        productId,
        like: true,
      },
      select: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return likes.map((like) => like.user);
  }
}
