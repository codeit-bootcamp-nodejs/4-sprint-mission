import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

export const ArticleCommentBodySchema = z
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
        if (!/^[^<>]*$/.test(val)) {
          ctx.addIssue({ code: "custom", message: "content: 금지 패턴 포함" });
        }
        // allowed 패턴 추가 (예: 한글/영문/숫자/공백만 허용)
        const allowed = /^[\p{L}\p{N}\s.,!?'"-]*$/u;
        if (!allowed.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "content: 허용되지 않은 문자",
          });
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

export const ArticleCommentQuerySchema = z
  .object({
    cursor: z
      .preprocess(
        (val) =>
          typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val,
        z
          .number()
          .int({ message: "정수여야 합니다" })
          .refine((n) => Number.isSafeInteger(n), {
            message: "안전한 정수 범위를 벗어났습니다",
          })
          .refine((n) => n >= 1 && n <= 10_000, {
            message: "정수 범위는 1 ~ 10000 입니다",
          })
      )
      .default(1),
    limit: z
      .preprocess(
        (val) =>
          typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val,
        z
          .number()
          .int({ message: "정수여야 합니다" })
          .refine((n) => Number.isSafeInteger(n), {
            message: "안전한 정수 범위를 벗어났습니다",
          })
          .refine((n) => n >= 1 && n <= 10, {
            message: "정수 범위는 1 ~ 10 입니다",
          })
      )
      .default(10),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });

export const ArticleCommentParamsSchema = z
  .object({
    commentId: z
      .preprocess(
        (val) =>
          typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val,
        z
          .number()
          .int({ message: "정수여야 합니다" })
          .refine((n) => Number.isSafeInteger(n), {
            message: "안전한 정수 범위를 벗어났습니다",
          })
          .refine((n) => n >= 1 && n <= Number.MAX_SAFE_INTEGER, {
            message: `정수 범위는 1 ~ ${Number.MAX_SAFE_INTEGER} 입니다`,
          })
      )
      .optional(),
    articleId: z.preprocess(
      (val) =>
        typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val,
      z
        .number()
        .int({ message: "정수여야 합니다" })
        .refine((n) => Number.isSafeInteger(n), {
          message: "안전한 정수 범위를 벗어났습니다",
        })
        .refine((n) => n >= 1 && n <= Number.MAX_SAFE_INTEGER, {
          message: `정수 범위는 1 ~ ${Number.MAX_SAFE_INTEGER} 입니다`,
        })
    ),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });
