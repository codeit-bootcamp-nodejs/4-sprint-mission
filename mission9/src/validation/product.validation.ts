  import { z } from "zod";

  // 스키마
  export const productIdSchema = z.object({
    id: z.coerce.number().positive().min(0, "0 보다 큰 정수이어야 합니다"),
  });

  export const accessListProductSchema = z.object({
    page: z.coerce
      .number()
      .positive()
      .min(1, "1 보다 큰 정수이어야 합니다")
      .default(1),
    take: z.coerce
      .number()
      .positive()
      .min(10, "10 보다 큰 정수이어야 합니다")
      .default(10),
    keyword: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다"),
    name: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다"),
    description: z.string("문자열 이어야합니다"),
  });

  export const createProductSchema = z.object({
    name: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다"),
    description: z
      .string()
      .min(1, "1글자 이상인 문자열이어야합니다")
      .max(200, "200자 이하인 문자열이어야 합니다"),
    tags: z.array(z.string()),
    price: z.coerce.number().positive().min(100, "100원 이상이어야 합니다"),
  });

  export const PatchProductSchema = z.object({
    name: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다")
      .optional(),
    description: z
      .string()
      .min(1, "1글자 이상인 문자열이어야합니다")
      .max(200, "200자 이하인 문자열이어야 합니다").optional(),
    tags: z.array(z.string()).optional(),
    price: z.coerce.number().positive().min(100, "100원 이상이어야 합니다")
      .optional(),
  });
