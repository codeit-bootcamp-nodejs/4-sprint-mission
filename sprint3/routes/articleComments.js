import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

router.post("/:articleId/comments", async (req, res) => {
  const articleId = Number(req.params.articleId);
  const { content } = req.body;

  if (isNaN(articleId) || !content) {
    return res.status(400).json({ error: "articleId와 content는 필수입니다." });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 등록 실패", code: err.code });
  }
});

router.patch("/:articleId/comments/:commentId", async (req, res) => {
  const commentId = Number(req.params.commentId);
  const articleId = Number(req.params.articleId);
  const { content } = req.body;

  if (isNaN(commentId) || isNaN(articleId) || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "댓글 업데이트 실패", code: err.code });
  }
});

router.delete("/:articleId/comments/:commentId", async (req, res) => {
  const commentId = Number(req.params.commentId);
  const articleId = Number(req.params.articleId);

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        articleId: articleId,
      },
    });

    res.status(200).json({ message: `${commentId} 삭제 완료` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    res.status(500).json({ error: "댓글 삭제 실패", code: err.code });
  }
});

router.get("/:articleId/comments", async (req, res) => {
  const articleId = Number(req.params.articleId);
  const { cursor = 1, limit = 10 } = req.query;

  try {
    const productComments = await prisma.comment.findMany({
      where: { articleId },
      take: parseInt(limit, 10),
      skip: 1,
      cursor: { id: parseInt(cursor, 10) },
      orderBy: { id: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(productComments);
  } catch (err) {
    res.status(500).json({ error: "댓글 조회 실패", code: err.code });
  }
});

export default router;
