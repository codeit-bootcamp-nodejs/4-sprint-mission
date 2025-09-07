// services/userService.js
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/hash.js";

// 프로필 조회
export async function getUserById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// 프로필 수정
export async function updateUserProfile(userId, updateData) {
  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      updatedAt: true,
    },
  });
}

// 비밀번호 변경
export async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password)
    throw new Error("User not found or no password set");

  const isMatch = await verifyPassword(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedNewPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
}

// 사용자 삭제
export async function deleteUserById(userId) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

// 유저가 등록한 상품 목록 조회
export async function getUserProducts(userId) {
  return prisma.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// 유저가 좋아요한 상품 목록 조회
export async function getLikedProducts(userId) {
  return prisma.product.findMany({
    where: {
      productLikes: {
        some: {
          userId,
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
}

// 유저가 좋아요한 게시글 목록 조회
export async function getLikedArticles(userId) {
  return prisma.article.findMany({
    where: {
      articleLikes: {
        some: {
          userId,
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
}
