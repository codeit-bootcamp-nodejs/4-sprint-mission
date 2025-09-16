import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

// 허용 문자 패턴 (Article과 동일: 한글/영문/숫자/공백/일부 구두점 허용)
const ALLOWED = /^[\p{L}\p{N}\s.,!?'"-]*$/u;

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
 * 상품 등록/수정 Body 스키마
 */
export const ProductBodySchema = z
  .object({
    name: z
      .string({ required_error: "상품 이름: required" })
      .min(1, { message: "상품 이름: 최소 1자 이상" })
      .max(100, { message: "상품 이름: 최대 100자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "상품 이름: 제어문자 불가" });
        }
        if (/[<>]/.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "상품 이름: 금지 패턴 포함",
          });
        }
        if (!ALLOWED.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "상품 이름: 허용되지 않은 문자",
          });
        }
      }),
    description: z
      .string({ required_error: "상품 설명: required" })
      .min(1, { message: "상품 설명: 최소 1자 이상" })
      .max(2000, { message: "상품 설명: 최대 2000자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "상품 설명: 제어문자 불가" });
        }
        if (/<script|<\/script>/i.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "상품 설명: 금지 패턴 포함",
          });
        }
        if (!ALLOWED.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "상품 설명: 허용되지 않은 문자",
          });
        }
      }),
    price: stringToInt(
      safeInt(0, 1_000_000_000, "정수 범위는 0 ~ 1000000000 입니다")
    ),
    tags: z
      .array(
        z
          .string({ required_error: "태그: required" })
          .min(1, { message: "태그: 최소 1자 이상" })
          .max(30, { message: "태그: 최대 30자 이하" })
          .transform((v) => v.trim().normalize("NFC"))
          .superRefine((val, ctx) => {
            if (CONTROL_OR_INVISIBLE.test(val)) {
              ctx.addIssue({ code: "custom", message: "태그: 제어문자 불가" });
            }
            if (!/^[a-zA-Z0-9가-힣]+$/.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "태그: 허용되지 않은 문자",
              });
            }
          })
      )
      .max(20, "태그는 최대 20개까지만 입력할 수 있습니다.")
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

/**
 * 상품 조회 Query 스키마
 */
export const ProductQuerySchema = z
  .object({
    page: stringToInt(safeInt(1, Number.MAX_SAFE_INTEGER)).default(1),
    pageSize: stringToInt(safeInt(1, 20, "정수 범위는 1 ~ 20 입니다")).default(
      10
    ),
    keyword: z
      .array(
        z
          .string({ required_error: "검색어: required" })
          .min(1, { message: "검색어: 최소 1자 이상" })
          .max(100, { message: "검색어: 최대 100자 이하" })
          .transform((v) => v.trim().normalize("NFC"))
          .superRefine((val, ctx) => {
            if (CONTROL_OR_INVISIBLE.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "검색어: 제어문자 불가",
              });
            }
            if (/[<>]/.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "검색어: 금지 패턴 포함",
              });
            }
            if (!ALLOWED.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: "검색어: 허용되지 않은 문자",
              });
            }
          })
      )
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

/**
 * 상품 단일 조회/삭제 Params 스키마
 */
export const ProductParamsSchema = z
  .object({
    id: stringToInt(safeInt(1, Number.MAX_SAFE_INTEGER)),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });
