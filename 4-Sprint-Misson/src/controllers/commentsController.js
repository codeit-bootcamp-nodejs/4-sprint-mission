import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class CommentsController {
  // 상품 댓글 등록
  async createForProduct(req, res) {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
      const comment = await prisma.comment.create({
        data: { content, productId: Number(productId), userId },
      });
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: "상품 댓글 등록 실패" });
    }
  }

  // 게시글 댓글 등록
  async createForArticle(req, res) {
    const { articleId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
      const comment = await prisma.comment.create({
        data: { content, articleId: Number(articleId), userId },
      });
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: "게시글 댓글 등록 실패" });
    }
  }

  // 댓글 수정
  async update(req, res) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
      const comment = await prisma.comment.findUnique({ where: { id: Number(id) } });
      if (!comment) return res.status(404).json({ error: "댓글 없음" });

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "권한 없음" });
      }

      const updated = await prisma.comment.update({
        where: { id: Number(id) },
        data: { content },
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "댓글 수정 실패" });
    }
  }

  // 댓글 삭제
  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const comment = await prisma.comment.findUnique({ where: { id: Number(id) } });
      if (!comment) return res.status(404).json({ error: "댓글 없음" });

      if (comment.userId !== userId) {
        return res.status(403).json({ error: "권한 없음" });
      }

      await prisma.comment.delete({ where: { id: Number(id) } });
      res.json({ message: "삭제 완료" });
    } catch (err) {
      res.status(500).json({ error: "댓글 삭제 실패" });
    }
  }

  // 상품 댓글 목록 조회
  async listForProduct(req, res) {
    const { productId } = req.params;
    const { cursor, take = 10 } = req.query;

    try {
      const comments = await prisma.comment.findMany({
        where: { productId: Number(productId) },
        take: Number(take),
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: Number(cursor) } : undefined,
        orderBy: { id: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, nickname: true } },
        },
      });

      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: "조회 실패" });
    }
  }

  // 게시글 댓글 목록 조회
  async listForArticle(req, res) {
    const { articleId } = req.params;
    const { cursor, take = 10 } = req.query;

    try {
      const comments = await prisma.comment.findMany({
        where: { articleId: Number(articleId) },
        take: Number(take),
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: Number(cursor) } : undefined,
        orderBy: { id: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, nickname: true } },
        },
      });

      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: "조회 실패" });
    }
  }
}
