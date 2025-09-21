import { ProductRepository, LikeRepository } from '../repositories/index.js';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductWithLikeStatusDto,
  ProductListResponseDto,
  ProductQueryDto,
} from '../dto/index.js';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private likeRepository: LikeRepository,
  ) {}

  async createProduct(
    productData: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productRepository.create(productData);
  }

  async getProductById(
    id: number,
    userId?: number,
  ): Promise<ProductWithLikeStatusDto | null> {
    const product = await this.productRepository.findByIdWithCounts(id);
    if (!product) return null;

    const isLiked = userId
      ? await this.likeRepository.checkProductLike(userId, id)
      : false;

    return {
      ...product,
      isLiked,
    };
  }

  async getProducts(
    query: ProductQueryDto,
    userId?: number,
  ): Promise<ProductListResponseDto> {
    const { products, totalCount } = await this.productRepository.findMany(
      query,
      userId,
    );

    if (!userId) {
      const productsWithLikeStatus = products.map((product) => ({
        ...product,
        isLiked: false,
      }));
      return { list: productsWithLikeStatus, totalCount };
    }

    const productIds = products.map((product) => product.id);
    const likeMap = await this.likeRepository.checkMultipleProductLikes(
      userId,
      productIds,
    );

    const productsWithLikeStatus = products.map((product) => ({
      ...product,
      isLiked: likeMap[product.id] || false,
    }));

    return { list: productsWithLikeStatus, totalCount };
  }

  async updateProduct(
    id: number,
    productData: UpdateProductDto,
    userId: number,
  ): Promise<ProductResponseDto> {
    const hasPermission = await this.productRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 상품을 수정할 권한이 없습니다.');
    }

    return await this.productRepository.update(id, productData);
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const hasPermission = await this.productRepository.checkOwnership(
      id,
      userId,
    );
    if (!hasPermission) {
      throw new Error('해당 상품을 삭제할 권한이 없습니다.');
    }

    await this.productRepository.delete(id);
  }

  async toggleLike(
    productId: number,
    userId: number,
  ): Promise<{ isLiked: boolean }> {
    const existingLike = await this.likeRepository.findByUserAndProduct(
      userId,
      productId,
    );

    if (existingLike) {
      await this.likeRepository.deleteByUserAndProduct(userId, productId);
      return { isLiked: false };
    } else {
      await this.likeRepository.create({
        userId,
        productId,
      });
      return { isLiked: true };
    }
  }
}
