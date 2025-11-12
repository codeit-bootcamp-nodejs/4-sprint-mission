import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidatedRequest } from "./article.controller";
export class articleValidation {
  // zod스키마
  private static articleQuerySchema = z.object({
    ownerId: z.coerce
      .number()
      .min(0, { message: "인덱스는 0 보다 크거나 같아야 합니다" }),
    page: z.coerce
      .number()
      .min(10, { message: "take number must be the bigger than 10" }),
    take: z.coerce
      .number()
      .min(1, { message: "page number must be the bigger than 1" }),
    keyword: z.enum(["content", "title"]).optional(),
  });
  private static articleBodySchema = z.object({
    content: z
      .string()
      .min(10, { message: "본문 의 길이는 10글자 이상이어야합니다" }),
    title: z
      .string()
      .min(10, { message: "제목 의 길이는 10글자 이상이어야합니다" }),
  });
  private static articleParamsSchema = z.object({
    id: z.coerce
      .number()
      .min(0, { message: "인덱스는 0 보다 크거나 같아야 합니다" }),
  });
  // validator
  static validateArticleById = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.articleParamsSchema.parse(req.params);
      (req as ValidatedRequest<typeof result>).validatedParams = result;
      next();
    } catch (error) {
      next(error);
    }
  };

  static validateGetArticleList = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.articleQuerySchema.parse(req.query);
      (req as ValidatedRequest<typeof result>).validatedQuery = result;
      next();
    } catch (error) {
      next(error);
    }
  };

  static validatCreateArticle = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.articleBodySchema.parse(req.body);
      next(result);
    } catch (error) {
      next(error);
    }
  };
}
