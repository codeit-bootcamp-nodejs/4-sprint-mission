import * as z from 'zod';

// prettier-ignore
export const signupSchema = z.object({
  email: z.email("이메일 형식이 올바르지 않습니다."),
  nickname: z.string().min(1, "닉네임을 입력해 주세요."),
  password: z.string().min(8, "비밀번호를 입력해주세요.")
}).strict();
