  import { z } from "zod";

  export const commentQuerySchema = z.object({
    page: z.coerce.number().positive().default(1),
    take: z.coerce.number().positive().default(10),
    keyword: z.enum(["content", "title"]).optional(),
  });

  export const commentParamSchema = z.object({
    id: z.coerce.number().positive(),
  });

  export const commentBodySchema = z.object({
    content: z.string().min(10, "10자 이상").max(100, "100자 이하"),
    title: z.string().min(1, "1글자 이상").max(10, "10자 이하"),
  });

  export const commentPatchSchema = z.object({
    content: z.string().min(10, "10자 이상").max(100, "100자 이하").optional(),
    title: z.string().min(1, "1글자 이상").max(10, "10자 이하").optional(),
  });
