import { z } from "zod";
  const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
  );

  export const changePasswordSchema = z.object({
    password: z
      .string()
      .min(6, "비밀번호는 6글자 이상 이어야 합니다")
      .regex(passwordRegex, "대문자, 소문자, 특수문자, 숫자를 포함 해야 합니다"),
  });

  export const updateUserInfoSchema = z.object({
    email: z.email("이메일 형태이어야 합니다"),
    nickname: z.string().min(2, "두글자 이상이어야 합니디."),
  });
