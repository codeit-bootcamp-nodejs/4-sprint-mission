import { z } from 'zod';

// Validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  nickname: z.string().min(1, 'Nickname is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  nickname: z.string().min(1).optional(),
  image: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

// DTO Types
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Response DTOs
export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}

// Type exports
export type {
  RegisterDto as RegisterDtoType,
  LoginDto as LoginDtoType,
  UpdateUserDto as UpdateUserDtoType,
};
