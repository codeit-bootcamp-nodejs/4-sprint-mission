import { ProductsRepository } from '../repositories/products.repository.js';
import { Prisma } from '@prisma/client';

export class ProductsService {
  productsRepository = new ProductsRepository();

  createProduct = async (name: string, content: string, userId: number) => {
    const newProduct = await this.productsRepository.createProduct({
      name,
      content,
      author: {
        connect: { id: userId },
      },
    });
    return newProduct;
  };

  getProducts = async () => {
    const products = await this.productsRepository.findProducts();
    return products;
  };

  getProductById = async (productId: number, userId?: number) => {
    const product = await this.productsRepository.findProductById(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    let isLiked = false;
    if (userId) {
      const like = await this.productsRepository.findProductLike(userId, productId);
      if (like) {
        isLiked = true;
      }
    }

    const responseProduct = { ...product, isLiked };
    return responseProduct;
  };

  updateProduct = async (productId: number, userId: number, name?: string, content?: string) => {
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }
    if (product.authorId !== userId) {
      const err = new Error("상품을 수정할 권한 없습니다.");
      err.name = "ForbiddenError";
      throw err;
    }

    if (!name && !content) {
      const err = new Error("수정할 정보를 입력해주세요.");
      err.name = "BadRequestError";
      throw err;
    }

    const dataToUpdate: Prisma.ProductUpdateInput = {};
    if (name) dataToUpdate.name = name;
    if (content) dataToUpdate.content = content;

    const updatedProduct = await this.productsRepository.updateProduct(productId, dataToUpdate);
    return updatedProduct;
  };

  deleteProduct = async (productId: number, userId: number) => {
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }
    if (product.authorId !== userId) {
      const err = new Error("상품 등록자만이 삭제할 수 있습니다.");
      err.name = "ForbiddenError";
      throw err;
    }

    await this.productsRepository.deleteProduct(productId);
  };

  toggleProductLike = async (productId: number, userId: number) => {
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      const err = new Error("상품을 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    const existingLike = await this.productsRepository.findProductLike(userId, productId);

    if (existingLike) {
      await this.productsRepository.deleteProductLike(userId, productId);
      return { message: "좋아요 취소했습니다." };
    } else {
      await this.productsRepository.createProductLike(userId, productId);
      return { message: "좋아요를 눌렀습니다." };
    }
  };

  getProductsByAuthor = async (userId: number) => {
    const products = await this.productsRepository.findProductsByAuthorId(userId);
    return products;
  };

  getLikedProducts = async (userId: number) => {
    const products = await this.productsRepository.findLikedProductsByUserId(userId);
    return products;
  };
}
