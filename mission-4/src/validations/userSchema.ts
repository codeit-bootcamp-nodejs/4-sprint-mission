import * as z from 'zod';

export const ContentType = ['products', 'articles', 'comments'] as const;

// prettier-ignore
export const patchSchema = z.object({
  email: z.email('이메일 형식이 올바르지 않습니다.'),
  nickname: z.string().min(1, "닉네임은 1글자 이상 입력해주세요."),
  changePassword: z.string().min(8, '비밀번호는 8자 이상 입력해야합니다.'),
  currentPassword: z.string().min(8, '비밀번호는 8자 이상 입력해야합니다.'),
  image: z.url()
}).refine(data => {
  // changePassword나 currentPassword 중 하나만 있으면 에러
  return !(data.changePassword && !data.currentPassword || !data.changePassword && data.currentPassword);
}, {
  message: "현재 비밀번호와 변경할 비밀번호를 모두 입력해주세요.",
}).refine(data => {
  // 두 필드가 존재할 경우, 서로 다른 값인지 검증
  return !data.changePassword || data.changePassword !== data.currentPassword;
}, {
  message: "변경할 비밀번호는 현재 비밀번호와 달라야 합니다.",
}).strict();

export const contentSchema = z.object({
  content: z.enum(ContentType),
});
