import { productLikeReposioty } from "../repositories/productLikeRepository";
import { productRepository } from "../repositories/productRepository";
import type { Like } from "../types/dto";

export const toggleProductLike = async (
  userId: number,
  productId: number
): Promise<{ liked: boolean; like: Like | null }> => {
  try {
    const product = await productRepository.getProductById(productId);

    if (!product) {
      const error: HttpError = new Error("존재하지 않는 상품입니다.");
      error.status = 400;
      throw error;
    }

    const existingLike = await productLikeReposioty.findLike(userId, productId);

    if (existingLike) {
      await productLikeReposioty.deleteLike(userId, productId);

      return { liked: false, like: null };
    } else {
      const like = await productLikeReposioty.createLike(userId, productId);

      return { liked: true, like };
    }
  } catch (err) {
    throw err;
  }
};
