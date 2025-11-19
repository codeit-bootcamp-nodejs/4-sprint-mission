import { z } from 'zod';

// Request DTOs
export const CreateProductDto = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().positive('Price must be a positive number'),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  userId: z.number().int().positive(),
});

export const UpdateProductDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export const GetProductsQueryDto = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  userId: z.number().int().positive().optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});

// Response DTOs
export const ProductResponseDto = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tags: z.array(z.string()),
  imageUrl: z.string().nullable(),
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
export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
export type GetProductsQuery = z.infer<typeof GetProductsQueryDto>;
export type ProductResponse = z.infer<typeof ProductResponseDto>;
