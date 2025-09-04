import { z } from "zod";

// User 유효성 검사 미들웨어는 zod 활용해서 구현해봄
// 이후에 시간 남으면 다른 유효성 검사도 zod로 바꾸기
export const signupSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야합니다." }),
  nickname: z
    .string()
    .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 형식이 아닙니다." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});
