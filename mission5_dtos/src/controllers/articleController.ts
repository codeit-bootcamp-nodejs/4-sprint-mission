import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import status from "http-status";
import { ArticleService } from "../services/articleService";

const articleService = new ArticleService();

// body 검증 (게시글 생성/수정)
const articleSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z
    .string()
    .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
    .max(200, { message: "내용은 최대 200자까지 가능합니다." })
});

// PATCH용 스키마 (선택적)
const articleUpdateSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }).optional(),
  content: z
    .string()
    .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
    .max(200, { message: "내용은 최대 200자까지 가능합니다." })
    .optional(),
});

// query 검증 (게시글 조회)
const articleQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform(Number)
    .refine((val) => val > 0, { message: "page는 1 이상의 정수여야 합니다." }),
  pageSize: z
    .string()
    .default("5")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: "pageSize는 1~100 사이여야 합니다.",
    }),
  keyword: z.string().default(""),
});

export class ArticleController {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
        const parsed = articleSchema.parse(req.body);
        const article = await articleService.create(req.user.id, parsed);
        res.status(status.CREATED).json(article);
      } catch (err) {
        next(err);
      }
    }

      async list(req: Request, res: Response, next: NextFunction) {
      try {
        const { page, pageSize, keyword } = articleQuerySchema.parse(req.query);
        const articles = await articleService.list(page, pageSize, keyword);
        res.status(status.OK).json(articles);
      } catch (err) {
        next(err);
      }
    }

      async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const articleId = Number(req.params.id);
      const article = await articleService.getDetail(articleId);
      if (!article) return res.status(status.NOT_FOUND).json({ message: "Product not found" });
      res.status(status.OK).json(article);
    } catch (err) {
      next(err);
    }
  }

    async update(req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
        const parsed = articleUpdateSchema.parse(req.body) as { title?: string; content?: string };
        const articleId = Number(req.params.id);
        const updated = await articleService.update(req.user.id, articleId, parsed);
        res.status(status.OK).json(updated);
      } catch (err: any) {
        if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Product not found" });
        if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
        next(err);
      }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
        const articleId = Number(req.params.id);
        await articleService.delete(req.user.id, articleId);
        res.status(status.NO_CONTENT).end();
      } catch (err: any) {
        if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Product not found" });
        if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
       next(err);
      }
    }
}