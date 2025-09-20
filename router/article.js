import express from "express";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, InternalServerError } from "../middleware/error.js";

const prisma = new PrismaClient();
const router = express.Router();

// 유효성 검사
import { validateArticle } from "../middleware/validate.js";

// 게시글 등록 + 목록 조회
router
  .route("/")
  .post(validateArticle, async (req, res) => {
    try {
      const { title, content } = req.body;
      const article = await prisma.article.create({
        data: { title, content },
      });
      res.status(201).json(article);
    } catch (e) {
      next(new InternalServerError("게시글 등록에 실패했습니다."));
    }
  })
  .get(async (req, res) => {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search?.toString() || "";

      const article = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      if (!article) next(new BadRequestError("게시글을 찾을 수 없습니다."));
      res.send(article);
    } catch (e) {
      next(new InternalServerError("게시글 목록 조회에 실패했습니다."));
    }
  });

// 게시물 상세 조회 + 수정 + 삭제
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      if (!article) {
        next(new BadRequestError("게시글을 찾을 수 없습니다."));
      }
      res.send(article);
    } catch (e) {
      next(new InternalServerError("게시물 상세 조회에 실패했습니다."));
    }
  })
  .patch(validateArticle, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content } = req.body;
      const updateData = {};

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      const article = await prisma.article.update({
        where: { id },
        data: updateData,
      });
      res.send(article);
    } catch (e) {
      next(new InternalServerError("게시글 수정에 실패했습니다."));
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    } catch (e) {
      next(new InternalServerError("게시글 삭제에 실패했습니다."));
    }
  });

export default router;
