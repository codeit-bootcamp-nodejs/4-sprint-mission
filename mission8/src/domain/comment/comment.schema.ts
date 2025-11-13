import z from 'zod';

export const commentSchema = {
  createComment: {
    params: z.object({
      postId: z.coerce.number().int().positive(),
    }),
    body: z.object({
      content: z.string().min(1, '댓글을 작성해주세요').max(1000, '댓글은 1000자를 초과할 수 없습니다'),
    }),
  },
};
