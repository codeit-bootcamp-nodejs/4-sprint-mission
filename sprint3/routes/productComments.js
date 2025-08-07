import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateNewComment } from "../middlewares/validate.js";

const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

router.post("/:productId/comments", validateNewComment, async (req, res) => {
  const productId = Number(req.params.productId);
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 등록 실패", code: err.code });
  }
});

router.patch("/:productId/comments/:commentId", async (req, res) => {
  const commentId = Number(req.params.commentId);
  const productId = Number(req.params.productId);
  const { content } = req.body;

  if (isNaN(commentId) || isNaN(productId) || !content) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        productId: productId,
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

router.delete("/:productId/comments/:commentId", async (req, res) => {
  const commentId = Number(req.params.commentId);
  const productId = Number(req.params.productId);

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        productId: productId,
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

router.get("/:productId/comments", async (req, res) => {
  const productId = Number(req.params.productId);
  const { cursor = 1, limit = 10 } = req.query;

  try {
    const productComments = await prisma.comment.findMany({
      where: { productId },
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
