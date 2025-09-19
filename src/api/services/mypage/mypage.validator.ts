import { z } from "zod";

export const updateUserSchema = z
  .object({
    nickname: z.string().min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." }).optional(),
    image: z.url({ message: "유효한 URL 형식이 아닙니다." }).optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    { message: "수정할 내용을 하나 이상 입력해주세요." }
  );

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: "기존 비밀번호를 입력해주세요." }),
  newPassword: z.string().min(8, { message: "새로운 비밀번호는 최소 8자 이상이어야합니다." }),
});
