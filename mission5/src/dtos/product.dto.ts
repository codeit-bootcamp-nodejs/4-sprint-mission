import { z } from "zod";


// CREATE DTO 
export const ProductCreateSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().default(""),
});
export type ProductCreateDTO = z.infer<typeof ProductCreateSchema>;

// UPDATE DTO
export const ProductUpdateSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }).optional(),
  description: z.string().min(10, { message: "설명은 최소 10자 이상" }).max(100, { message: "설명은 최대 100자" }).optional(),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }).optional(),
  tags: z.string().default("").optional(),
});
export type ProductUpdateDTO = z.infer<typeof ProductUpdateSchema>;

// QUERY DTO
export const ProductQuerySchema = z.object({
  page: z.string().default("1").transform(Number).refine((v) => v > 0),
  pageSize: z.string().default("5").transform(Number).refine((v) => v > 0 && v <= 100),
  keyword: z.string().default(""),
});
export type ProductQueryDTO = z.infer<typeof ProductQuerySchema>;