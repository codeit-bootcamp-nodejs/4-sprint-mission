import { z } from 'zod';

// Request DTOs
export const CreateArticleDto = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  userId: z.number().int().positive(),
});

export const UpdateArticleDto = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

export const GetArticlesQueryDto = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(['createdAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  userId: z.number().int().positive().optional(),
  search: z.string().optional(),
});

// Response DTOs
export const ArticleResponseDto = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
  user: z.object({
    id: z.number(),
    nickname: z.string(),
    image: z.string().nullable(),
  }),
  likeCount: z.number(),
  commentCount: z.number(),
});

// Type inference
export type CreateArticleInput = z.infer<typeof CreateArticleDto>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleDto>;
export type GetArticlesQuery = z.infer<typeof GetArticlesQueryDto>;
export type ArticleResponse = z.infer<typeof ArticleResponseDto>;
