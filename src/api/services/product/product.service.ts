import type { CustomError } from "../../types/error.js";
import type { FindManyParams } from "../../types/express.d.ts";
import * as ProductRepository from "../../repositories/product.repository.js";
import type { ProductDto } from "./product.dto.js";

const ProductService = {
  async createProduct(productData: ProductDto, userId: number) {
    const newProduct = await ProductRepository.create({
      ...productData,
      user: { connect: { id: userId } },
    });
    return newProduct;
  },

  async findUniqueProduct(productId: number, userId: number) {
    const product = await ProductRepository.findById(productId);

    if (!userId) {
      return { ...product, isLiked: false };
    }

    const like = await ProductRepository.findLikeByUserAndProduct(userId, productId);
    return { ...product, isLiked: !!like };
  },

  async patchProduct(id: number, updateData: ProductDto, userId: number) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      const error: CustomError = new Error("존재하지 않는 상품입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (product.userId != userId) {
      const error: CustomError = new Error("상품을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }
    return await ProductRepository.update(id, updateData);
  },

  async deleteProduct(id: number, userId: number) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      const error: CustomError = new Error("존재하지 않는 상품입니다.");
      error.statusCode = 404;
      throw error;
    }

    if (product.userId !== userId) {
      const error: CustomError = new Error("상품을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }
    return await ProductRepository.remove(id);
  },

  async findManyProduct(params: FindManyParams) {
    const products = await ProductRepository.findMany(params);
    return products;
  },
};

export default ProductService;
