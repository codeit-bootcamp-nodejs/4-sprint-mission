import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateNewComment } from "../middlewares/validate.js";

const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

router.post(
  "/:articleId/comments",
  validateNewComment,
  async (req, res, next) => {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          article: { connect: { id: articleId } },
        },
      });

      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/:articleId/comments/:commentId", async (req, res, next) => {
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
    next(err);
  }
});

router.delete("/:articleId/comments/:commentId", async (req, res, next) => {
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
    next(err);
  }
});

router.get("/:articleId/comments", async (req, res, next) => {
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
    next(err);
  }
});

export default router;
