import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.post("/products/:produtId/comments", async (req, res) => {
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
