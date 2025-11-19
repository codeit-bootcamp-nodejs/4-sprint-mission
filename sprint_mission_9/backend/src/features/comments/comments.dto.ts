import { z } from 'zod';

// Request DTOs
export const CreateCommentDto = z
  .object({
    content: z.string().min(1, 'Comment content is required'),
    userId: z.number().int().positive(),
    productId: z.number().int().positive().optional(),
    articleId: z.number().int().positive().optional(),
  })
  .refine((data) => data.productId !== undefined || data.articleId !== undefined, {
    message: 'Either productId or articleId must be provided',
  });

export const UpdateCommentDto = z.object({
  content: z.string().min(1).optional(),
});

export const GetCommentsQueryDto = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  productId: z.number().int().positive().optional(),
  articleId: z.number().int().positive().optional(),
});

// Response DTOs
export const CommentResponseDto = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
  productId: z.number().nullable(),
  articleId: z.number().nullable(),
  user: z.object({
    id: z.number(),
    nickname: z.string(),
    image: z.string().nullable(),
  }),
});

// Type inference
export type CreateCommentInput = z.infer<typeof CreateCommentDto>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentDto>;
export type GetCommentsQuery = z.infer<typeof GetCommentsQueryDto>;
export type CommentResponse = z.infer<typeof CommentResponseDto>;
