import { z } from "zod";

const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

export const UpdateProfileBodySchema = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "닉네임: 최소 2자 이상" })
      .max(30, { message: "닉네임: 최대 30자 이하" })
      .transform((v) => v.trim().normalize("NFC"))
      .refine((val) => !CONTROL_OR_INVISIBLE.test(val), {
        message: "닉네임: 제어문자 불가",
      })
      .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
        message: "닉네임: 영문, 숫자, 밑줄만 허용됩니다",
      })
      .optional(),

    image: z
      .string()
      .url({ message: "이미지 URL이 유효하지 않습니다." })
      .min(10, { message: "이미지 URL: 최소 10자 이상" })
      .max(500, { message: "이미지 URL: 최대 500자 이하" })
      .refine((val) => !CONTROL_OR_INVISIBLE.test(val), {
        message: "이미지 URL: 제어문자 불가",
      })
      .refine(
        (val) => /^https:\/\/cdn\.yourservice\.com\/avatars\//.test(val),
        {
          message: "허용되지 않은 이미지 도메인입니다.",
        }
      )
      .transform((v) => v.trim().normalize("NFC"))
      .optional(),
  })
  .strict()
  .superRefine((obj, ctx) => {
    for (const k of Object.keys(obj)) {
      if (["__proto__", "constructor", "prototype"].includes(k)) {
        ctx.addIssue({ code: "custom", message: `허용되지 않은 키: ${k}` });
      }
    }
  });

export const ChangePasswordBodySchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "현재 비밀번호: 최소 8자 이상" })
      .max(128, { message: "현재 비밀번호: 최대 128자 이하" })
      .regex(/[A-Z]/, {
        message: "현재 비밀번호는 최소 1개의 대문자를 포함해야 합니다.",
      })
      .regex(/[a-z]/, {
        message: "현재 비밀번호는 최소 1개의 소문자를 포함해야 합니다.",
      })
      .regex(/[0-9]/, {
        message: "현재 비밀번호는 최소 1개의 숫자를 포함해야 합니다.",
      })
      .regex(/[@$!%*?&]/, {
        message: "현재 비밀번호는 최소 1개의 특수문자를 포함해야 합니다.",
      })
      .transform((v) => v.normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "현재 비밀번호: 제어문자 불가",
          });
        }
      }),

    newPassword: z
      .string()
      .min(8, { message: "새로운 비밀번호: 최소 8자 이상" })
      .max(128, { message: "새로운 비밀번호: 최대 128자 이하" })
      .regex(/[A-Z]/, {
        message: "새로운 비밀번호는 최소 1개의 대문자를 포함해야 합니다.",
      })
      .regex(/[a-z]/, {
        message: "새로운 비밀번호는 최소 1개의 소문자를 포함해야 합니다.",
      })
      .regex(/[0-9]/, {
        message: "새로운 비밀번호는 최소 1개의 숫자를 포함해야 합니다.",
      })
      .regex(/[@$!%*?&]/, {
        message: "새로운 비밀번호는 최소 1개의 특수문자를 포함해야 합니다.",
      })
      .transform((v) => v.normalize("NFC"))
      .superRefine((val, ctx) => {
        if (CONTROL_OR_INVISIBLE.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "새로운 비밀번호: 제어문자 불가",
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
