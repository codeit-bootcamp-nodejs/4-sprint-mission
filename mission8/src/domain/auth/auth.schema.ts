import { z } from 'zod';

export const authSchema = {
  login: {
    body: z.object({
      email: z.string().email('유효한 이메일 형식이 아닙니다'),
      password: z
        .string()
        .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
        .max(100, '비밀번호는 100자를 초과할 수 없습니다'),
    }),
  },
};
