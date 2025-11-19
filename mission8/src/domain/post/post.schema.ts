import z from 'zod';

export const postSchema = {
  create: {
    body: z.object({
      title: z
        .string()
        .min(1, { message: '제목은 1자 이상이어야 합니다' })
        .max(200, { message: '제목은 200자 이하여야 합니다' }),
      content: z
        .string()
        .min(1, { message: '내용은 1자 이상이어야 합니다' })
        .max(1000, { message: '내용은 1000자 이하여야 합니다' }),
    }),
  },
};
