import { z } from "zod";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const createSchema = z
  .object({
    content: z.string().min(1),
  })
  .strict();

export function create(req: Request, res: Response, next: NextFunction) {
  const result = createSchema.safeParse(req.body);

  if (result.success) {
    return next();
  } else {
    return next(createError(400, `잘못된 입력값입니다.`));
  }
}
