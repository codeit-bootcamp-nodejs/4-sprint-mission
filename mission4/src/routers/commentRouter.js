import express from "express";
import prisma from "../lib/prisma.js";
import passport from "../lib/passport/index.js";
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

const commentQuerySchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: "id는 숫자여야 합니다." })
    .transform(Number),
  lastId: z
    .string()
    .regex(/^\d+$/, { message: "lastId는 숫자여야 합니다." })
    .transform(Number)
    .optional(),
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
  "/comments/products",
  passport.authenticate("access-token", { session: false }),
  productCommentList
);
router.get(
  "/comments/articles",
  passport.authenticate("access-token", { session: false }),
  articleCommentList
);

async function createProductComment(req, res, next) {
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

async function createArticleComment(req, res, next) {
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

async function modifyComment(req, res, next) {
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

async function deleteComment(req, res) {
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

async function productCommentList(req, res, next) {
  const parsed = querySchema.parse(req.query); // 유효성 검사 + 변환
  const { id: productId, lastId } = parsed;

  try {
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
      take: 5, //첫 불러내는 comment가 총 5개 이고 lastId가 지정이 안되면 skip 의 값은 0이 되고 있다면 1로 설정
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }), //lastId의 값이 있을때 괄호가 풀어지며 내부의 'cursor: { id: lastId }가 작동함
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

async function articleCommentList(req, res, next) {
  const parsed = querySchema.parse(req.query);
  const { id: articleId, lastId } = parsed;

  try {
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
