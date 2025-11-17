import { z } from "zod";
  export const querySchema = z.object({
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
      .max(10, "10자 이하인 문자열이어야합니다")
      .optional(),
    title: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다")
      .optional(),
    content: z.string("문자열 이어야합니다"),
  });

  export const bodySchema = z.object({
    id: z.coerce.number().positive(),
    content: z
      .string()
      .min(10, "10글자 이상인  문자열이어야합니다")
      .max(100, "100자 이하인 문자열이어야합니다")
      .optional(),
    title: z
      .string()
      .min(1, "1글자 이상인  문자열이어야합니다")
      .max(10, "10자 이하인 문자열이어야합니다")
      .optional(),
    comments: z.array(z.string()),
  });

  export const paramsSchema = z.object({
    id: z.coerce.number().positive(),
  });
