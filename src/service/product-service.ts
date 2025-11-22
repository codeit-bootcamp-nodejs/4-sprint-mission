import { Prisma, Product } from "@prisma/client";
import { ProductRepository } from "../repository/product-repository.js";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductListResponseDto,
  ProductDetailResponseDto,
} from "../types/dto.js";
import { LikeRepository } from "../repository/like-repository.js";
import { NotificationService } from "./notification-service.js";

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private likeRepository: LikeRepository,
    private notificationService: NotificationService
  ) {}

  createProduct = async (
    userId: number,
    createProductDto: CreateProductDto
  ): Promise<Product> => {
    const { name, description, price, tags } = createProductDto;
    return await this.productRepository.createProduct(
      userId,
      name,
      description,
      price,
      tags
    );
  };

  getProducts = async (
    page: number,
    limit: number,
    search: string | undefined,
    userId: number | undefined
  ): Promise<ProductListResponseDto> => {
    const whereCondition: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const offset = (page - 1) * limit;

    const products = await this.productRepository.findManyProducts(
      whereCondition,
      offset,
      limit,
      userId
    );
    const totalCount =
      await this.productRepository.countProducts(whereCondition);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: products,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  getProductById = async (
    productId: string,
    userId: number | undefined
  ): Promise<ProductDetailResponseDto> => {
    const product = await this.productRepository.findProductById(
      productId,
      userId
    );
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
    return product;
  };

  updateProduct = async (
    userId: number,
    productId: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> => {
    const oldProduct = await this.productRepository.findProductById(productId);
    if (!oldProduct) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
    if (oldProduct.userId !== userId) {
      throw new Error("상품을 수정할 권한이 없습니다.");
    }

    // 가격 변동 알림 로직 (업데이트 실행 전)
    const newPrice = updateProductDto.price;
    if (newPrice !== undefined && newPrice !== oldProduct.price) {
      // 이 상품을 좋아요한 사용자 ID 목록 조회
      const userIdsToNotify = await this.likeRepository.findUserIdsByProductId(
        oldProduct.id
      );

      // 알림 메시지 및 링크 생성
      const message = `'${oldProduct.name}' 상품의 가격이 ${oldProduct.price}원에서 ${newPrice}원으로 변동되었습니다.`;
      const link = `/products/${oldProduct.id}`;

      // 각 사용자에게 알림 전송 (상품 주인 제외)
      for (const id of userIdsToNotify) {
        if (id !== userId) {
          // 상품 주인에게는 알림을 보내지 않음
          await this.notificationService.createAndSendNotification(
            id,
            message,
            "PRICE_CHANGE",
            link
          );
        }
      }
    }

    // 실제 상품 정보 업데이트
    return await this.productRepository.updateProduct(
      productId,
      updateProductDto
    );
  };

  deleteProduct = async (userId: number, productId: string): Promise<void> => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }
    if (product.userId !== userId) {
      throw new Error("상품을 삭제할 권한이 없습니다.");
    }
    await this.productRepository.deleteProduct(productId);
  };
}
