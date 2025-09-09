import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class LikeController {
  // 상품 좋아요 / 취소
  async toggleProductLike(req, res) {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    try {
      const existing = await prisma.like.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existing) {
        // 좋아요 취소
        await prisma.like.delete({ where: { id: existing.id } });
        return res.json({ message: "상품 좋아요 취소" });
      } else {
        // 좋아요 등록
        await prisma.like.create({
          data: { userId, productId },
        });
        return res.json({ message: "상품 좋아요 등록" });
      }
    } catch (err) {
      res.status(500).json({ error: "상품 좋아요 처리 실패" });
    }
  }

  // 게시글 좋아요 / 취소
  async toggleArticleLike(req, res) {
    const userId = req.user.id;
    const articleId = Number(req.params.articleId);

    try {
      const existing = await prisma.like.findUnique({
        where: { userId_articleId: { userId, articleId } },
      });

      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        return res.json({ message: "게시글 좋아요 취소" });
      } else {
        await prisma.like.create({
          data: { userId, articleId },
        });
        return res.json({ message: "게시글 좋아요 등록" });
      }
    } catch (err) {
      res.status(500).json({ error: "게시글 좋아요 처리 실패" });
    }
  }

  // 유저가 좋아요 누른 상품 목록 조회
  async getUserLikedProducts(req, res) {
    const userId = req.user.id;
    try {
      const likes = await prisma.like.findMany({
        where: { userId, productId: { not: null } },
        include: { product: true },
      });

      const products = likes.map((like) => like.product);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "좋아요 상품 조회 실패" });
    }
  }
}
