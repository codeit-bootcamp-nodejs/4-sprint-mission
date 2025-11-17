import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import createError from "http-errors";

export const createSchema = z
  .object({
    title: z.string().min(1),
    content: z.string().min(1),
  })
  .strict();

export const updateSchema = z
  .object({
    title: z.string().min(1),
    content: z.string().min(1),
  })
  .strict()
  .partial();

export function create(req: Request, res: Response, next: NextFunction) {
  const result = createSchema.safeParse(req.body);

  if (result.success) {
    next();
  } else {
    throw next(createError(404, "입력값이 유효하지 않습니다."));
  }
}

export function update(req: Request, res: Response, next: NextFunction) {
  const result = updateSchema.safeParse(req.body);

  if (result.success) {
    next();
  } else {
    throw next(createError(404, "입력값이 유효하지 않습니다."));
  }
}
