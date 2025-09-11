import type { CustomError } from "../types/error.js";
import type { CreateProductData, UpdateProductData, FindManyProductParams } from "../types/product.js";
import * as ProductRepository from "../repositories/ProductRepository.js";

const ProductService = {
  async createProduct(productData: CreateProductData, userId: number) {
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

  async patchProduct(id: number, updateData: UpdateProductData, userId: number) {
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

  async findManyProduct(params: FindManyProductParams) {
    return await ProductRepository.findMany(params);
  },
};

export default ProductService;
