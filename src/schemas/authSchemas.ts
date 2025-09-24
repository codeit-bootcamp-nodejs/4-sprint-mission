import { z } from "zod";

// 제어문자·제로폭·Bidi 차단용 정규식
const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

/**
 * 회원가입 검증
 */
export const RegisterBodySchema = z
  .object({
    email: z.string().min(5).max(254).email("유효한 이메일을 입력해주세요."),
    nickname: z
      .string({ required_error: "nickname: required" })
      .min(2, { message: "nickname: 최소 2자 이상" })
      .max(30, { message: "nickname: 최대 30자 이하" })
      .regex(/^[a-zA-Z0-9_]+$/, "nickname: 허용되지 않은 문자")
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "nickname: 제어문자 불가" });
        }
      }),
    password: z
      .string({ required_error: "password: required" })
      .min(8, { message: "password: 최소 8자 이상" })
      .max(128, { message: "password: 최대 128자 이하" })
      .regex(/[A-Z]/, "비밀번호는 최소 1개의 대문자를 포함해야 합니다.")
      .regex(/[a-z]/, "비밀번호는 최소 1개의 소문자를 포함해야 합니다.")
      .regex(/[0-9]/, "비밀번호는 최소 1개의 숫자를 포함해야 합니다.")
      .regex(/[@$!%*?&]/, "비밀번호는 최소 1개의 특수문자를 포함해야 합니다.")
      .transform((v) => v.normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "password: 제어문자 불가" });
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

/**
 * 로그인 검증
 */
export const LoginBodySchema = z
  .object({
    nickname: z
      .string({ required_error: "nickname: required" })
      .min(2, { message: "nickname: 최소 2자 이상" })
      .max(30, { message: "nickname: 최대 30자 이하" })
      .regex(/^[a-zA-Z0-9_]+$/, "nickname: 허용되지 않은 문자")
      .transform((v) => v.trim().normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "nickname: 제어문자 불가" });
        }
      }),
    password: z
      .string({ required_error: "password: required" })
      .min(8, { message: "password: 최소 8자 이상" })
      .max(128, { message: "password: 최대 128자 이하" })
      .transform((v) => v.normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({ code: "custom", message: "password: 제어문자 불가" });
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

/**
 * 토큰 리프레시 검증
 */
export const RefreshTokenSchema = z
  .object({
    refreshToken: z
      .string({ required_error: "refreshToken: required" })
      .min(20, { message: "refreshToken: 최소 20자 이상" })
      .max(2000, { message: "refreshToken: 최대 2000자 이하" })
      .regex(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        "유효한 JWT 형식의 refreshToken이어야 합니다."
      )
      .transform((v) => v.normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "refreshToken: 제어문자 불가",
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
