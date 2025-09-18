import bcrypt from "bcrypt";
import type { CustomError } from "../../types/error.js";
import * as MypageRepository from "../../repositories/mypage.repository.js";
import type { UpdateUserDTO, UpdatePasswordDTO } from "../../types/dtos/mypage.dto.js";
import type { Prisma } from "@prisma/client";
import { generateTokens } from "../../libs/token.js";
import { hashing } from "../../libs/hashing.js";
import * as AuthRepository from "../../repositories/auth.repository.js";
import { log } from "console";

const MypageService = {
  async getUser(userId: number) {
    const user = await MypageRepository.findUserProfile(userId);

    if (!user) {
      const error: CustomError = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  async updateUser(userId: number, updateData: UpdateUserDTO) {
    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (updateData.nickname !== undefined) {
      dataToUpdate.nickname = updateData.nickname;
    }

    if (updateData.image !== undefined) {
      dataToUpdate.nickname = updateData.image;
    }

    const updatedUser = await MypageRepository.update(userId, dataToUpdate);

    const { password, refreshToken, ...UserData } = updatedUser;
    return UserData;
  },

  async updatePassword(userId: number, updatePasswordDTO: UpdatePasswordDTO) {
    const { oldPassword, newPassword } = updatePasswordDTO;
    const user = await MypageRepository.findUserForAuth(userId);

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
    const hashedNewPassword = await hashing(newPassword);
    await MypageRepository.updatePassword(userId, hashedNewPassword);

    // 새로운 토큰 발급 (Access, Refresh)
    const { accessToken, refreshToken } = generateTokens(userId);

    const hashedRefreshToken = await hashing(refreshToken);
    await AuthRepository.updateUserRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  },

  async deleteUser(userId: number) {
    const user = await MypageRepository.findUserProfile(userId);

    if (!user) {
      const error: CustomError = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    await MypageRepository.deleteUser(userId);
  },

  async getProducts(userId: number) {
    const products = await MypageRepository.findProductsByUserId(userId);

    return products;
  },

  async getLikeProducts(userId: number) {
    const likedProducts = await MypageRepository.findLikedProductsByUserId(userId);

    return likedProducts.map((like: { product: any }) => like.product);
  },
};

export default MypageService;
