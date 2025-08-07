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
