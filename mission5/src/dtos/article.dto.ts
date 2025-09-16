import { z } from "zod";

// CREATE DTO
export const ArticleCreateSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z
    .string()
    .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
    .max(200, { message: "내용은 최대 200자까지 가능합니다." }),
});
export type ArticleCreateDTO = z.infer<typeof ArticleCreateSchema>;

// UPDATE DTO (PATCH)
export const ArticleUpdateSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }).optional(),
  content: z
    .string()
    .min(10, { message: "내용은 최소 10자 이상이어야 합니다." })
    .max(200, { message: "내용은 최대 200자까지 가능합니다." })
    .optional(),
});
export type ArticleUpdateDTO = z.infer<typeof ArticleUpdateSchema>;

// QUERY DTO (GET /articles)
export const ArticleQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform(Number)
    .refine((val) => val > 0, { message: "page는 1 이상의 정수여야 합니다." }),
  pageSize: z
    .string()
    .default("5")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, { message: "pageSize는 1~100 사이여야 합니다." }),
  keyword: z.string().default(""),
});
export type ArticleQueryDTO = z.infer<typeof ArticleQuerySchema>;
