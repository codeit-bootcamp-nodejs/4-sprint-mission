import express from "express";
import prisma from "../lib/prisma.js";
import passport from "../lib/passport/index.js";
import { z } from "zod";
import status from "http-status";

const router = express.Router();

// body 검증 (게시글 생성/수정)
const articleSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }).optional(),
  content: z
    .string()
    .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
    .max(200, { message: "내용은 최대 200자까지 가능합니다." })
    .optional()
});

// query 검증 (게시글 조회)
const articleQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((val) => val > 0, { message: "page는 1 이상의 정수여야 합니다." }),
  pageSize: z
    .string()
    .optional()
    .default("5")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: "pageSize는 1~100 사이여야 합니다.",
    }),
  keyword: z.string().optional().default(""),
});

router.post(
  "/articles",
  passport.authenticate("access-token", { session: false }),
  createArticle
);
router.get("/articles", getArticles);
router.patch(
  "/articles/:id",
  passport.authenticate("access-token", { session: false }),
  modifyArticle
);
router.delete(
  "/articles/:id",
  passport.authenticate("access-token", { session: false }),
  deleteArticle
);
router.get(
  "/articles/:id",
  passport.authenticate("access-token", { session: false }),
  getDetailArticle
);

async function createArticle(req, res, next) {
  const user = req.user;
  const parsed = articleSchema.parse(req.body);

  try {
    const article = await prisma.article.create({
      data: {
        ...parsed,
        userId: user.id,
      },
    });

    res.status(status.CREATED).json(article);
  } catch (err) {
    next(err);
  }
}

async function getArticles(req, res, next) {
  const { page, pageSize, keyword } = articleQuerySchema.parse(req.query);
  const where = keyword //title과 content 에서 원하는 keyword가 있는 데이터를 찾도록 만든 변수
    ? {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive", //대소문자 구분 없이 검색하기 위해
            },
          },
          {
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      }
    : {}; //기본값 {}으로 빈 객체를 수식하기 위함

  try {
    const articles = await prisma.article.findMany({
      skip: (page - 1) * pageSize, //offset pagination
      take: pageSize,
      orderBy: {
        // 최신 순서대로 정렬하기(최신순)
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where,
    });

    res.status(status.OK).json(articles);
  } catch (error) {
    next(err);
  }
}

async function modifyArticle(req, res, next) {
  const articleId = Number(req.params.id);
  const parsed = articleSchema.parse(req.body);
  const user = req.user;

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Article not found" });
    }
    if (article.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...parsed,
      },
    });
    res.status(status.OK).json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  const articleId = Number(req.params.id);
  const user = req.user;

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Article not found" });
    }
    if (article.userId !== user.id) {
      return res.status(status.FORBIDDEN).json({ message: "User not matched" });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(status.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
}

async function getDetailArticle(req, res, next) {
  const articleId = Number(req.params.id);

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) {
      return res.status(status.NOT_FOUND).json({ error: "Article not found" });
    }
    res.status(status.OK).json(article);
  } catch (err) {
    next(err);
  }
}

export default router;
