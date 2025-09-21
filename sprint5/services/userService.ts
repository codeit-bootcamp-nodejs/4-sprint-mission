import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userReposioty.js";
import type {
  UpdateUserData,
  UserProduct,
} from "../repositories/userReposioty.js";

interface UserProductWithLike extends UserProduct {
  isLiked: boolean;
}

export const userService = {
  findUser: async (id: number): Promise<Express.User | null> => {
    try {
      return await userRepository.findUser(id);
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (
    id: number,
    data: UpdateUserData
  ): Promise<Express.User> => {
    try {
      return await userRepository.updateUser(id, data);
    } catch (err) {
      throw err;
    }
  },

  updatePassword: async (id: number, password: string): Promise<void> => {
    try {
      const user = await userRepository.findUserWithPassword(id);

      if (!user) {
        const error: HttpError = new Error("사용자를 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        const error: HttpError = new Error("현재 비밀번호와 동일합니다.");
        error.status = 400;
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      await userRepository.updatePassword(id, hashedPassword);
    } catch (err) {
      throw err;
    }
  },

  findUserProduct: async (id: number): Promise<UserProduct[]> => {
    try {
      return await userRepository.findUserProduct(id);
    } catch (err) {
      throw err;
    }
  },

  findLikedProducts: async (userId: number): Promise<UserProductWithLike[]> => {
    const products = await userRepository.findLikedProducts(userId);

    return products.map((product) => ({
      ...product,
      isLiked: true,
    }));
  },
};
