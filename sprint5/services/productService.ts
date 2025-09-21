import { productRepository } from "../repositories/productRepository.js";
import type { Product, ProductWithLike } from "../types/dto.js";

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

      const likedProducts = await productRepository.findLikedProducts(
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

      return await productRepository.updateProduct(
        id,
        name,
        description,
        price,
        tags
      );
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
