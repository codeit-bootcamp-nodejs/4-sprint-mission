import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

/**
 * 안전한 문자열 스키마
 * - min/max 길이 제약
 * - 제어문자·제로폭·Bidi 차단
 * - 허용/금지 패턴 검사
 * - trim + normalize(NFC) 처리
 */
export function safeString(opts = {}) {
  const min = opts.min ?? 1;
  const max = opts.max ?? 200;
  const label = opts.label ?? "string";

  return z
    .string({ required_error: `${label}: required` })
    .min(min, { message: `${label}: 최소 ${min}자 이상` })
    .max(max, { message: `${label}: 최대 ${max}자 이하` })
    .transform((v) => {
      let s = opts.trim ? v.trim() : v;
      return s.normalize("NFC");
    })
    .superRefine((val, ctx) => {
      if (CONTROL_OR_INVISIBLE.test(val)) {
        ctx.addIssue({ code: "custom", message: `${label}: 제어문자 불가` });
      }
      if (opts.allowed && !opts.allowed.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: `${label}: 허용되지 않은 문자`,
        });
      }
      if (opts.forbid && opts.forbid.test(val)) {
        ctx.addIssue({ code: "custom", message: `${label}: 금지 패턴 포함` });
      }
    });
}

/**
 * 안전한 정수 스키마
 * - 문자열 숫자도 안전하게 파싱
 * - 안전한 정수 범위 검사
 * - min/max 범위 제한
 */
export function intSafe(min, max) {
  return z.preprocess(
    (val) => {
      if (typeof val === "string" && /^\d+$/.test(val)) {
        return Number(val);
      }
      return val;
    },
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
      .refine(
        (n) =>
          (min === undefined || n >= min) && (max === undefined || n <= max),
        {
          message:
            min !== undefined && max !== undefined
              ? `정수 범위는 ${min} ~ ${max} 입니다`
              : min !== undefined
              ? `정수는 ${min} 이상이어야 합니다`
              : max !== undefined
              ? `정수는 ${max} 이하이어야 합니다`
              : "정수 범위 오류",
        }
      )
  );
}

/**
 * 안전한 객체 스키마
 * - strict 모드로 정의되지 않은 키 차단
 * - prototype pollution 방어
 */
export function strictObject(shape) {
  return z
    .object(shape)
    .strict()
    .superRefine((obj, ctx) => {
      for (const k of Object.keys(obj)) {
        if (["__proto__", "constructor", "prototype"].includes(k)) {
          ctx.addIssue({
            code: "custom",
            message: `허용되지 않은 키: ${k}`,
          });
        }
      }
    });
}
