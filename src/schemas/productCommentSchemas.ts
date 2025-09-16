import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

const safeInt = (min: number, max: number, message?: string) =>
  z
    .number()
    .int({ message: "정수여야 합니다" })
    .superRefine((n, ctx) => {
      if (!Number.isSafeInteger(n)) {
        ctx.addIssue({
          code: "custom",
          message: "안전한 정수 범위를 벗어났습니다",
        });
      }
    })
    .refine((n) => n >= min && n <= max, {
      message: message ?? `정수 범위는 ${min} ~ ${max} 입니다`,
    });

const stringToInt = (schema: z.ZodTypeAny) =>
  z.preprocess(
    (val) => (typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val),
    schema
  );

/**
 * 상품 댓글 스키마
 */
export const ProductCommentBodySchema = z
  .object({
    content: z
      .string({ required_error: "content: required" })
      .min(1, { message: "content: 최소 1자 이상" })
      .max(500, { message: "content: 최대 500자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "content: 제어문자 불가" });
        }
      }),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });

export const ProductCommentQuerySchema = z
  .object({
    cursor: stringToInt(safeInt(1, Number.MAX_SAFE_INTEGER)).default(1),
    limit: stringToInt(safeInt(1, 20, "정수 범위는 1 ~ 20 입니다")).default(10),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });

export const ProductCommentParamsSchema = z
  .object({
    commentId: stringToInt(safeInt(1, Number.MAX_SAFE_INTEGER)).optional(),
    productId: stringToInt(safeInt(1, Number.MAX_SAFE_INTEGER)),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });
