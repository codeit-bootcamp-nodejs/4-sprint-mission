import { z } from "zod";

export const RegisterDto = z.object({
  email: z.string().email(),
  nickname: z.string().min(2),
  password: z.string().min(8),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateMeDto = z.object({
  nickname: z.string().min(2).optional(),
  image: z.string().url().nullable().optional(),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const CreateProductDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
});
export const UpdateProductDto = CreateProductDto.partial();

export const CreatePostDto = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
export const UpdatePostDto = CreatePostDto.partial();

export const CreateCommentDto = z.object({
  content: z.string().min(1),
});
