import prisma from "../libs/prismaClient.js";
import type { Prisma } from "@prisma/client";

export const findUserProfile = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      nickname: true,
      image: true,
    },
  });
};

export const findUserForAuth = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const update = async (userId: number, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const updatePassword = async (userId: number, hashedNewPassword: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

export const deleteUser = async (userId: number) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

export const findProductsByUserId = async (userId: number) => {
  return await prisma.product.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findLikedProductsByUserId = async (userId: number) => {
  return await prisma.like.findMany({
    where: { userId, productId: { not: null } },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
