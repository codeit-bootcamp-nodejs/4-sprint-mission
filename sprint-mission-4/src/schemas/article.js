import { z } from "zod";

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

export function create(req, res, next) {
  const result = createSchema.safeParse(req.body);

  if (result.success) {
    next();
  } else {
    throw next(createError(404, "입력값이 유효하지 않습니다."));
  }
}

export function update(req, res, next) {
  const result = updateSchema.safeParse(req.body);

  if (result.success) {
    next();
  } else {
    throw next(createError(404, "입력값이 유효하지 않습니다."));
  }
}
