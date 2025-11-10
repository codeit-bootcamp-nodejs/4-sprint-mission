import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateContent, validateId } from "../middleware/validate.js";
import { BadRequestError, InternalServerError } from "../middleware/error.js";

const prisma = new PrismaClient();
const router = express.Router();

// 마켓 댓글 + 목록 조회
router
  .route("/product/:id")
  .post(validateContent, validateId, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { content } = req.body;

      const comment = await prisma.comment.create({
        data: {
          content,
          product: { connect: { id: productId } },
        },
      });
      res.status(201).json(comment);
    } catch (e) {
      next(new InternalServerError("댓글 작성에 실패했습니다."));
    }
  })
  .get(validateId, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const take = parseInt(req.query.take) || 10;
      const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

      const comment = await prisma.comment.findMany({
        where: { productId },
        take: take,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(comment);
    } catch (e) {
      next(new InternalServerError("댓글 조회에 실패했습니다."));
    }
  });

// 게시판 댓글 + 목록 조회
router
  .route("/article/:id")
  .post(validateId, validateContent, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { content } = req.body;

      const comment = await prisma.comment.create({
        data: {
          content,
          article: { connect: { id: articleId } },
        },
      });
      res.status(201).json(comment);
    } catch (e) {
      next(new InternalServerError("댓글 작성에 실패했습니다."));
    }
  })
  .get(validateId, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const take = parseInt(req.query.take) || 10;
      const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

      const comment = await prisma.comment.findMany({
        where: { articleId },
        take,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(comment);
    } catch (e) {
      next(new InternalServerError("댓글 조회에 실패했습니다."));
    }
  });

// 댓글 수정 + 삭제
router
  .route("/:id")
  .patch(validateId, validateContent, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;

      const updated = await prisma.comment.update({
        where: { id },
        data: { content },
      });
      res.json(updated);
    } catch (e) {
      next(new InternalServerError("댓글 수정을 실패했습니다."));
    }
  })
  .delete(validateId, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.comment.delete({
        where: { id },
      });
      res.sendStatus(204);
    } catch (e) {
      next(new InternalServerError("댓글 삭제에 실패했습니다."));
    }
  });

export default router;
