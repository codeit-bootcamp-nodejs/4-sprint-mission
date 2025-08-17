import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// 댓글 등록
router.post("/", async (req, res) => {
  try {
    const { content, productId, articleId } = req.body;
    if (!content) return res.status(400).json({ error: "댓글 내용을 입력하세요." });

    // productId 또는 articleId 중 하나는 있어야 함
    if (!productId && !articleId) {
      return res.status(400).json({ error: "productId 또는 articleId 중 하나는 필수입니다." });
    }

    const comment = await prisma.comment.create({
      data: { content, productId, articleId }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: "댓글 등록 실패" });
  }
});

// 댓글 수정
router.patch("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { content }
    });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: "댓글 수정 실패" });
  }
});

// 댓글 삭제
router.delete("/:id", async (req, res) => {
  try {
    await prisma.comment.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: "댓글 삭제 실패" });
  }
});

// 댓글 목록 조회 (커서 방식 등 필요시 추가 가능, 여기선 간단 페이징)
router.get("/", async (req, res) => {
  try {
    const { page = 1, perPage = 10, productId, articleId } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);

    // productId, articleId 필터링 중첩 방지: 둘 중 하나만 설정 가능
    const where = {};
    if (productId) where.productId = Number(productId);
    else if (articleId) where.articleId = Number(articleId);

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(perPage)
    });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: "댓글 목록 조회 실패" });
  }
});

export default router;
