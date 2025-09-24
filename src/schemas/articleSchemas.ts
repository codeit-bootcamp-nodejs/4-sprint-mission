import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

// 허용 문자 패턴 (예: 한글/영문/숫자/공백/일부 구두점 허용)
const ALLOWED = /^[\p{L}\p{N}\s.,!?'"-]*$/u;

export const ArticleBodySchema = z
  .object({
    title: z
      .string({ required_error: "title: required" })
      .min(1, { message: "title: 최소 1자 이상" })
      .max(100, { message: "title: 최대 100자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "title: 제어문자 불가" });
        }
        if (/[<>]/.test(val)) {
          ctx.addIssue({ code: "custom", message: "title: 금지 패턴 포함" });
        }
        if (!ALLOWED.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "title: 허용되지 않은 문자",
          });
        }
      }),
    content: z
      .string({ required_error: "content: required" })
      .min(1, { message: "content: 최소 1자 이상" })
      .max(5000, { message: "content: 최대 5000자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "content: 제어문자 불가" });
        }
        if (/<script|<\/script>/i.test(val)) {
          ctx.addIssue({ code: "custom", message: "content: 금지 패턴 포함" });
        }
        if (!ALLOWED.test(val)) {
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

export const ArticleQuerySchema = z
  .object({
    page: z
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
    pageSize: z
      .preprocess(
        (val) =>
          typeof val === "string" && /^\d+$/.test(val) ? Number(val) : val,
        z
          .number()
          .int({ message: "정수여야 합니다" })
          .refine((n) => Number.isSafeInteger(n), {
            message: "안전한 정수 범위를 벗어났습니다",
          })
          .refine((n) => n >= 1 && n <= 50, {
            message: "정수 범위는 1 ~ 50 입니다",
          })
      )
      .default(10),
    keyword: z
      .array(
        z
          .string({ required_error: "keyword: required" })
          .min(1, { message: "keyword: 최소 1자 이상" })
          .max(50, { message: "keyword: 최대 50자 이하" })
          .transform((v) => v.trim().normalize("NFC"))
          .superRefine((val, ctx) => {
            if (CONTROL_OR_INVISIBLE.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "keyword: 제어문자 불가",
              });
            }
            if (/[<>]/.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "keyword: 금지 패턴 포함",
              });
            }
            if (!ALLOWED.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "keyword: 허용되지 않은 문자",
              });
            }
          })
      )
      .max(5)
      .optional()
      .default([]),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });

export const ArticleParamsSchema = z
  .object({
    id: z.preprocess(
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
