import express, { type Request, type Response, type NextFunction } from "express";
import prisma from "../lib/prisma";
import passport from "../lib/passport/index";
import { z } from "zod";
import status from "http-status";

const router = express.Router();

// body 검증 (댓글 생성/수정)
const commentSchema = z.object({
  content: z
    .string()
    .min(5, { message: "덧글은 최소 5자 이상이어야 합니다." })
    .max(100, { message: "덧글은 최대 100자까지 가능합니다." }),
});

const commentListSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "id는 양의 정수여야 합니다." }),
  lastId: z.coerce.number().int().positive().optional(),
});

router.post(
  "/comments/products/:id",
  passport.authenticate("access-token", { session: false }),
  createProductComment
);
router.post(
  "/comments/articles/:id",
  passport.authenticate("access-token", { session: false }),
  createArticleComment
);
router.patch(
  "/comments/:id",
  passport.authenticate("access-token", { session: false }),
  modifyComment
);
router.delete(
  "/comments/:id",
  passport.authenticate("access-token", { session: false }),
  deleteComment
);
router.get(
  "/comments/products/:id",
  passport.authenticate("access-token", { session: false }),
  productCommentList
);
router.get(
  "/comments/articles/:id",
  passport.authenticate("access-token", { session: false }),
  articleCommentList
);

async function createProductComment(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const productId = Number(req.params.id);
  const parsed = commentSchema.parse(req.body);
  const user = req.user;

  try {
    const comment = await prisma.comment.create({
      data: {
        ...parsed,
        productId,
        articleId: null,
        userId: user.id,
      },
    });

    res.status(status.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
}

async function createArticleComment(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const articleId = Number(req.params.id);
  const parsed = commentSchema.parse(req.body);
  const user = req.user;

  try {
    const comment = await prisma.comment.create({
      data: {
        ...parsed,
        productId: null,
        articleId,
        userId: user.id,
      },
    });

    res.status(status.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
}

async function modifyComment(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const commentId = Number(req.params.id);
  const parsed = commentSchema.parse(req.body);
  const user = req.user;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Comment not found" });
    }
    if (comment.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: {
        ...parsed,
      },
    });
    res.status(status.OK).json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const commentId = Number(req.params.id);
  const user = req.user;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Comment not found" });
    }
    if (comment.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(status.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
}

async function productCommentList(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = commentListSchema.parse({
      id: req.params.id,
      lastId: req.query.lastId,
    });
    const { id: productId, lastId } = parsed;

    const comments = await prisma.comment.findMany({
      where: {
        AND: [
          {
            articleId: null,
          },
          {
            productId,
          },
        ],
      },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(status.OK).json(comments);
  } catch (err) {
    next(err);
  }
}

async function articleCommentList(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = commentListSchema.parse({
      id: req.params.id,
      lastId: req.query.lastId,
    });
    const { id: articleId, lastId } = parsed;
    
    const comments = await prisma.comment.findMany({
      where: {
        AND: [
          {
            articleId,
          },
          {
            productId: null,
          },
        ],
      },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(status.OK).json(comments);
  } catch (err) {
    next(err);
  }
}

export default router;
