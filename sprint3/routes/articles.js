import express from "express";
import { PrismaClient } from "@prisma/client";
import commentArticleRouter from "./articleComments.js";
import { validateArtCreate, validateId, validateArtQuery } from "../middlewares/validate.js";

const articleRouter = express.Router();

const prisma = new PrismaClient();

articleRouter.use(express.json());

articleRouter
  .route("/")
  .get(validateArtQuery, async (req, res, next) => {
    const { offset = 0, limit = 10, title, content } = req.query;

    const filter = [];

    if (title) {
      filter.push({ title: { contains: title } });
    }

    if (content) {
      filter.push({ content: { contains: content } });
    }

    const where = filter.length > 0 ? { AND: filter } : {};

    try {
      const articles = await prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: parseInt(offset, 10),
        take: parseInt(limit, 10),
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      if (articles.length === 0) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  })

  .post(validateArtCreate, async (req, res, next) => {
    const { title, content } = req.body;

    try {
      const articles = await prisma.article.create({
        data: {
          title,
          content,
        },
      });

      res.status(201).json(articles);
    } catch (err) {
      next(err);
    }
  });

articleRouter
  .route("/:id")
  .get(validateId, async (req, res, next) => {
    const id = Number(req.params.id);

    try {
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
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }

      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  })

  .patch(validateId, async (req, res, next) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    try {
      const article = await prisma.article.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
        },
      });

      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  })

  .delete(validateId, async (req, res, next) => {
    const id = Number(req.params.id);

    try {
      await prisma.article.delete({ where: { id } });

      res.status(200).json({ message: `${id} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  });

articleRouter.use("/:articleId/comments", commentArticleRouter);

export default articleRouter;
