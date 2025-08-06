import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.post("/products/:productId/comments", async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;

  if (!productId || !content) {
    return res.status(400).json({ error: "productId와 content는 필수입니다." });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: parseInt(productId) } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 등록 실패", code: err.code });
  }
});

app.post("/articles/:articleId/comments", async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  if (!articleId || !content) {
    return res
      .status(400)
      .json({ error: "articleId와 content는 필수입니다. " });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: parseInt(articleId) } },
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 등록 실패", code: err.code });
  }
});

app.patch("/products/:productId/comments/:commentId", async (req, res) => {
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
    if (err.code === "P2025") {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    res.status(500).json({ error: "댓글 업데이트 실패", code: err.code });
  }
});
