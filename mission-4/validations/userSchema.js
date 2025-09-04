import * as z from "zod";

// prettier-ignore
export const patchSchema = z.object({
  email: z.email('이메일 형식이 올바르지 않습니다.'),
  nickname: z.string().min(1, "닉네임은 1글자 이상 입력해주세요."),
  changePassword: z.string().min(8, '비밀번호는 8자 이상 입력해야합니다.'),
  currentPassword: z.string().min(8, '비밀번호는 8자 이상 입력해야합니다.'),
  Image: z.url()
}).strict();

export const contentSchema = z.object({
  content: z.enum(["product", "article", "comment"]),
});
