import { z } from "zod";

const CONTROL_OR_INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFEFF\u202A-\u202E]/;

//1차 입력값 방어를 위한 쿼리 스키마
export const QueryGuardSchema = z
  .object({
    page: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z
          .number()
          .int({ message: "page는 정수여야 합니다" })
          .min(1, { message: "page는 1 이상" })
      )
      .optional(),

    pageSize: z
      .preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z
          .number()
          .int({ message: "pageSize는 정수여야 합니다" })
          .min(1, { message: "pageSize는 1 이상" })
          .max(100, { message: "pageSize는 최대 100" })
      )
      .optional(),
  })
  .catchall(
    z
      .string()
      .max(200, { message: "쿼리 값은 최대 200자 이하" })
      .refine((val) => !CONTROL_OR_INVISIBLE.test(val), {
        message: "쿼리 값에 제어문자 불가",
      })
      .refine((val) => /^[^<>]*$/.test(val), {
        message: "쿼리 값에 <, > 사용 불가",
      })
      .transform((v) => v.trim().normalize("NFC"))
      .optional()
  )
  .strict();
