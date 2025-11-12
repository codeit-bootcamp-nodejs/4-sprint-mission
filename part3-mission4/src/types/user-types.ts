// Prisma user update data 타입
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prismaClient.js';

// prisma가 유저를 조회했을 때 나오는 실제 User 타입
export type RawUser = NonNullable<
  Awaited<ReturnType<typeof prisma.user.findUnique>>
>;

// Service 계층에서 DB에 업데이트할 때 사용하는 타입
export type UserUpdateData = Prisma.UserUpdateInput;

// Prisma 유저 레코드에서 password 제거한 타입
export type UserWithoutPassword = {
  id: number;
  username: string;
  email: string;
  images: string[] | null;
};

// Service 응답용 유저 프로필 DTO
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  images: string[];
}

// 댓글 DTO
export interface CommentResponse {
  content: string;
  article?: {
    id: number;
    title: string;
  } | null;
  product?: {
    id: number;
    name: string;
  } | null;
  likeCount: number;
}
