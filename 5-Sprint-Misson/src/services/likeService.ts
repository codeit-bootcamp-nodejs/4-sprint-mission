import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LikeService {
  // 상품 좋아요 토글
  async toggleProductLike(userId: number, productId: number) {
    const existing = await prisma.like.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return { message: "상품 좋아요 취소" };
    } else {
      await prisma.like.create({ data: { userId, productId } });
      return { message: "상품 좋아요 등록" };
    }
  }

  // 게시글 좋아요 토글
  async toggleArticleLike(userId: number, articleId: number) {
    const existing = await prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return { message: "게시글 좋아요 취소" };
    } else {
      await prisma.like.create({ data: { userId, articleId } });
      return { message: "게시글 좋아요 등록" };
    }
  }

  // 유저가 좋아요 누른 상품 조회
  async getUserLikedProducts(userId: number) {
    const likes = await prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: { product: true },
    });

    return likes.map((like) => like.product);
  }
}
