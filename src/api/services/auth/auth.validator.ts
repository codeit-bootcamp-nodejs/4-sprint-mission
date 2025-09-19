import { z } from "zod";

export const signupSchema = z.object({
  email: z.email({ message: "유효한 이메일 형식이 아닙니다." }),
  password: z.string().min(8, { message: "비밀번호는 최소 8자 이상이어야합니다." }),
  nickname: z.string().min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." }),
});

export const loginSchema = z.object({
  email: z.email({ message: "유효한 이메일 형식이 아닙니다." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});
