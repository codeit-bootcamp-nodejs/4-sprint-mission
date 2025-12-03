import { ProductsRepository } from '../repositories/products.repository.js';
import { Prisma, NotificationType } from '@prisma/client';
import { NotificationsService } from './notifications.service.js';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto.js';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '../errors/http-error.js';

export class ProductsService {
  productsRepository: ProductsRepository;
  notificationsService = NotificationsService.getInstance();

  constructor(productsRepository: ProductsRepository) {
    this.productsRepository = productsRepository;
  }

  createProduct = async (createProductDto: CreateProductDto, userId: number) => {
    const { name, content, price } = createProductDto;
    const newProduct = await this.productsRepository.createProduct({
      name,
      content,
      price,
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
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    let isLiked = false;
    if (userId) {
      const like = await this.productsRepository.findProductLike(
        userId,
        productId,
      );
      if (like) {
        isLiked = true;
      }
    }

    const responseProduct = { ...product, isLiked };
    return responseProduct;
  };

  updateProduct = async (
    productId: number,
    userId: number,
    updateProductDto: UpdateProductDto,
  ) => {
    const { name, content, price } = updateProductDto;
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }
    if (product.authorId !== userId) {
      throw new ForbiddenError('상품을 수정할 권한 없습니다.');
    }

    if (!name && !content && price === undefined) {
      throw new BadRequestError('수정할 정보를 입력해주세요.');
    }

    const dataToUpdate: Prisma.ProductUpdateInput = {};
    if (name) dataToUpdate.name = name;
    if (content) dataToUpdate.content = content;
    if (price !== undefined) dataToUpdate.price = price;

    const updatedProduct = await this.productsRepository.updateProduct(
      productId,
      dataToUpdate,
    );

    // 가격 변동에 대한 알림
    if (price !== undefined && product.price !== price) {
      const likedUsers =
        await this.productsRepository.findProductLikesByProductId(productId);

      const notificationPromises = likedUsers.map((like) =>
        this.notificationsService.createNotification(
          like.userId,
          NotificationType.PRICE_CHANGE,
          `좋아요한 상품 '${product.name}'의 가격이 ${product.price}원에서 ${price}원으로 변경되었습니다.`,
          productId,
        ),
      );

      await Promise.all(notificationPromises);
    }

    return updatedProduct;
  };

  deleteProduct = async (productId: number, userId: number) => {
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }
    if (product.authorId !== userId) {
      throw new ForbiddenError('상품 등록자만이 삭제할 수 있습니다.');
    }

    await this.productsRepository.deleteProduct(productId);
  };

  toggleProductLike = async (productId: number, userId: number) => {
    const product = await this.productsRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const existingLike = await this.productsRepository.findProductLike(
      userId,
      productId,
    );

    if (existingLike) {
      await this.productsRepository.deleteProductLike(userId, productId);
      return { message: '좋아요 취소했습니다.' };
    } else {
      await this.productsRepository.createProductLike(userId, productId);
      return { message: '좋아요를 눌렀습니다.' };
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