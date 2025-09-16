// services/userService.js
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/hash.js";
import type {
  GetUserByIdInput,
  GetUserByIdResult,
  UpdateProfileInput,
  UpdateProfileResult,
  ChangePasswordInput,
  ChangePasswordResult,
  DeleteUserByIdInput,
  DeleteUserByIdResult,
  GetUserProductsInput,
  GetUserProductsResult,
  GetLikedProductsInput,
  GetLikedProductsResult,
  GetLikedArticlesInput,
  GetLikedArticlesResult,
} from "../types/service/user.service.types.js";

// 프로필 조회
export const getUserById = async (
  data: GetUserByIdInput
): Promise<GetUserByIdResult | null> => {
  return prisma.user.findUnique({
    where: { id: data.userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// 프로필 수정
export const updateUserProfile = async (
  data: UpdateProfileInput
): Promise<UpdateProfileResult> => {
  return prisma.user.update({
    where: { id: data.userId },
    data: {
      ...(data.nickname !== undefined && { nickname: data.nickname }),
      ...(data.image !== undefined && { image: data.image }),
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      updatedAt: true,
    },
  });
};

// 비밀번호 변경
export const changeUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<ChangePasswordResult> => {
  // 유저 조회
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password)
    throw new Error("User not found or no password set");

  // 현재 비밀번호 확인
  const isMatch = await verifyPassword(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  // 새 비밀번호 해싱
  const hashedNewPassword = await hashPassword(newPassword);

  // 업데이트 후 필요한 필드만 반환
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
    select: {
      id: true,
      email: true,
      nickname: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// 사용자 삭제
export const deleteUserById = async (
  data: DeleteUserByIdInput
): Promise<DeleteUserByIdResult> => {
  return prisma.user.delete({
    where: { id: data.userId },
  });
};

// 유저가 등록한 상품 목록 조회
export const getUserProducts = async (
  data: GetUserProductsInput
): Promise<GetUserProductsResult> => {
  return prisma.product.findMany({
    where: { id: data.userId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// 유저가 좋아요한 상품 목록 조회
export const getLikedProducts = async (
  data: GetLikedProductsInput
): Promise<GetLikedProductsResult> => {
  return prisma.product.findMany({
    where: {
      productLikes: {
        some: {
          userId: data.userId,
        }, // productLikes에 현재 유저의 좋아요가 존재하는 게시글
      },
    },
    include: {
      User: {
        select: { id: true, nickname: true },
      },
      _count: {
        select: { productLikes: true },
      },
    },
  });
};

// 유저가 좋아요한 게시글 목록 조회
export const getLikedArticles = async (
  data: GetLikedArticlesInput
): Promise<GetLikedArticlesResult> => {
  return prisma.article.findMany({
    where: {
      articleLikes: {
        some: {
          userId: data.userId,
        }, // articleLikes에 현재 유저의 좋아요가 존재하는 게시글
      },
    },
    include: {
      User: {
        select: { id: true, nickname: true },
      },
      _count: {
        select: { articleLikes: true },
      },
    },
  });
};
