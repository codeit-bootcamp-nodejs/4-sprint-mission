import { productRepository } from "../repositories/productRepository.js";
import { likeRepository } from "../repositories/likeRepository.js";
import { notificationRepository } from "../repositories/notificationRepository.js";
import { emitToUser } from "../utils/notificationSocket.js";
import type { Like, Product, ProductWithLike } from "../types/dto.js";

export const productService = {
  getProducts: async (
    offset: number,
    limit: number,
    name: string | undefined,
    description: string | undefined,
    userId: number | null
  ): Promise<ProductWithLike[]> => {
    try {
      const products = await productRepository.getProducts(
        offset,
        limit,
        name,
        description
      );
      if (products.length === 0) {
        const error: HttpError = new Error("상품을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (!userId) {
        return products.map((products) => ({ ...products, isLiked: false }));
      }

      const likedProducts: Like[] = await productRepository.findLikedProducts(
        userId,
        products.map((product) => product.id)
      );

      const likedProductIds = new Set(
        likedProducts.map((like) => like.productId)
      );

      return products.map((products) => ({
        ...products,
        isLiked: likedProductIds.has(products.id),
      }));
    } catch (err) {
      throw err;
    }
  },

  createProduct: async (
    name: string,
    description: string,
    price: number,
    tags: string[],
    userId: number
  ): Promise<Product> => {
    try {
      return await productRepository.createProduct(
        name,
        description,
        price,
        tags,
        userId
      );
    } catch (err) {
      throw err;
    }
  },

  getProductById: async (
    id: number,
    userId: number
  ): Promise<ProductWithLike> => {
    try {
      const product = await productRepository.getProductById(id);

      if (!product) {
        const error: HttpError = new Error("상품을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      let isLiked = false;
      if (userId) {
        const like = await productRepository.findLikedProducts(userId, [id]);
        isLiked = like.length > 0;
      }

      return { ...product, isLiked };
    } catch (err) {
      throw err;
    }
  },

  updateProduct: async (
    id: number,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined,
    tags: string[] | undefined,
    userId: number
  ): Promise<Product> => {
    try {
      const product = await productRepository.getProductById(id);

      if (!product) {
        const error: HttpError = new Error("상품을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (product.userId != userId) {
        const error: HttpError = new Error("상품을 수정할 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      // 🔸 기존 가격 저장
      const oldPrice = product.price;

      // 🔹 상품 수정
      const updatedProduct = await productRepository.updateProduct(
        id,
        name,
        description,
        price,
        tags
      );

      // 🔸 가격 변경 감지
      if (price !== undefined && oldPrice !== price) {
        //  좋아요한 사용자 목록 조회
        const likedUsers = await likeRepository.getUsersWhoLikedProduct(id);

        // 각 사용자에게 알림 생성
        for (const { user } of likedUsers) {
          await notificationRepository.createNotification({
            userId: user.id,
            type: "PRICE_CHANGE",
            message: `좋아요한 상품 "${updatedProduct.name}"의 가격이 ${oldPrice}원 → ${price}원으로 변경되었습니다.`,
            targetId: updatedProduct.id,
          });

          // 실시간 알림 전송
          emitToUser(user.id, {
            type: "PRICE_CHANGE",
            productId: updatedProduct.id,
            message: `좋아요한 상품 "${updatedProduct.name}"의 가격이 ${oldPrice}원 → ${price}원으로 변경되었습니다.`,
          });
        }
      }

      return updatedProduct;
    } catch (err) {
      throw err;
    }
  },

  deleteProduct: async (id: number, userId: number): Promise<void> => {
    try {
      const product = await productRepository.getProductById(id);

      if (!product) {
        const error: HttpError = new Error("상품을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      if (product.userId != userId) {
        const error: HttpError = new Error("상품을 삭제할 권한이 없습니다.");
        error.status = 403;
        throw error;
      }

      await productRepository.deleteProduct(id);
    } catch (err) {
      throw err;
    }
  },
};
