import prisma from "../libs/prismaClient.js";
import type { Prisma } from "@prisma/client";

// User 생성
export const create = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

// 이메일로 사용자 찾기
export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

// id로 사용자 찾기
export const findById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

// user 정보 수정
export const update = async (id: number, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const updateUserRefreshToken = async (id: number, refreshToken: string | null) => {
  return await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
};
