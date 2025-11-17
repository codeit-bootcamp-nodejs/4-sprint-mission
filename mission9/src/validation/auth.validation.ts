import { z } from "zod";
  // auth schema

  const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
  );
  export const authRegisterSchema = z.object({
    nickname: z.string().min(2, "두글자 이상이어야 합니다"),
    email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(6, "비밀번호는 6글자 이상 이어야 합니다")
      .regex(passwordRegex, "대문자, 소문자, 특수문자, 숫자를 포함 해야 합니다"),
  });

  export const authLoginSchema = z.object({
    email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(6, "비밀번호는 6글자 이상 이어야 합니다")
      .regex(passwordRegex, "대문자, 소문자, 특수문자, 숫자를 포함 해야 합니다"),
  });
