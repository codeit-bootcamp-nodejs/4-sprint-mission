import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => val >= 1, { message: "page는 1보다 커야 합니다" }),
});

export const sortSchema = z.object({
  sort: z
    .string()
    .optional()
    .refine((val) => val === "latest" || val === undefined, {
      message: 'sort 값은 "latest" 여야 합니다',
    }),
});

export const articleIdSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Invalid Id",
  }),
});

export const modifyArticleSchema = z.object({
  title: z.string().nonempty({ message: "Invalid title" }),
  content: z.string().nonempty({ message: "Invalid content" }),
});
