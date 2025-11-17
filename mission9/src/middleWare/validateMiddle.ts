import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "올바르지 못한 본문 요청",
        error: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "올바르지 못한 쿼리값 입니다",
        error: result.error.issues,
      });
    }
    req.query = result.data as any;
    next();
  };
}

export function validateParam<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "올바르지 못한 파리미터 값 입니다",
        error: result.error.issues,
      });
    }
    req.params = result.data as any;
    next();
  };
}
