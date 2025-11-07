import { ProductsRepository } from '../repositories/products.repository.js';
import { Prisma, NotificationType } from '@prisma/client'; // Import NotificationType
import { NotificationsService } from './notifications.service.js'; // Import NotificationsService

export class ProductsService {
  productsRepository = new ProductsRepository();
  notificationsService = NotificationsService.getInstance(); // Get singleton instance

  createProduct = async (name: string, content: string, userId: number, price?: number) => { // price 추가
    const newProduct = await this.productsRepository.createProduct({
      name,
      content,
      price, // price 추가
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

  updateProduct = async (productId: number, userId: number, name?: string, content?: string, price?: number) => { // Add price
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

    if (!name && !content && price === undefined) { // Check for price as well
      const err = new Error("수정할 정보를 입력해주세요.");
      err.name = "BadRequestError";
      throw err;
    }

    const dataToUpdate: Prisma.ProductUpdateInput = {};
    if (name) dataToUpdate.name = name;
    if (content) dataToUpdate.content = content;
    if (price !== undefined) dataToUpdate.price = price; // Add price to update data

    const updatedProduct = await this.productsRepository.updateProduct(productId, dataToUpdate);

    // Notification for price change
    if (price !== undefined && product.price !== price) {
      const likedUsers = await this.productsRepository.findProductLikesByProductId(productId); // Need to implement this in repository
      for (const like of likedUsers) {
        await this.notificationsService.createNotification(
          like.userId,
          NotificationType.PRICE_CHANGE,
          `좋아요한 상품 '${product.name}'의 가격이 ${product.price}원에서 ${price}원으로 변경되었습니다.`,
          productId,
        );
      }
    }

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
