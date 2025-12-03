import { z } from "zod";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const createSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    tags: z.array(z.string()),
  })
  .strict();

export const updateSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    tags: z.array(z.string()),
  })
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
