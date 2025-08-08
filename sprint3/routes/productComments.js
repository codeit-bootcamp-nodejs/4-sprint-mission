import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateNewComment, validateCommentUpdate, validateId } from "../middlewares/validate.js";

const commnetRouter = express.Router({ mergeParams: true });

const prisma = new PrismaClient();

commnetRouter.use(express.json());

commnetRouter
  .route("/")
  .get(async (req, res, next) => {
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
      next(err);
    }
  })

  .post(validateNewComment, async (req, res, next) => {
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
      next(err);
    }
  });

commnetRouter
  .route("/:commentId")
  .patch(validateCommentUpdate, async (req, res, next) => {
    const commentId = Number(req.params.commentId);
    const productId = Number(req.params.productId);
    const { content } = req.body;

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
      next(err);
    }
  })

  .delete(validateId, async (req, res, next) => {
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
      next(err);
    }
  });

export default commnetRouter;
