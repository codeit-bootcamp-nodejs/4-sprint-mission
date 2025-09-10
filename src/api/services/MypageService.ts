import prisma from "../libs/prismaClient.js";
import bcrypt from "bcrypt";
import type { UserData } from "../types/user.js";
import type { CustomError } from "../types/error.js";

const MypageService = {
  async getUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        nickname: true,
        image: true,
      },
    });

    if (!user) {
      const error: CustomError = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
    }

    return user;
  },

  async updateUser(userId: number, updateData: UserData) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password, refreshToken, ...UserData } = updatedUser;
    return UserData;
  },

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: CustomError = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    // 기존 비밀번호 일치 여부 확인 (입력값으로 기존 비밀번호 받음)
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const error: CustomError = new Error("기존 비밀번호가 일치하지 않습니다.");
      error.statusCode = 403;
      throw error;
    }

    // 새로운 비밀번호 해시 처리
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  },

  async getProducts(userId: number) {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  },

  async getLikeProducts(userId: number) {
    const likedProducts = await prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likedProducts.map((like) => like.product);
  },
};

export default MypageService;
