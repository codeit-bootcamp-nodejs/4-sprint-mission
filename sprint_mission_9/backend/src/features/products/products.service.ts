import { ProductsRepository } from './products.repository';
import { ProductFilter, PaginationParams, PaginatedResponse } from '../../shared/types/models';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from './products.dto';

export class ProductsService {
  constructor(private repository: ProductsRepository) {}

  async getProducts(query: GetProductsQuery) {
    const filter: ProductFilter & PaginationParams = {
      page: query.page,
      limit: query.limit,
      orderBy: query.orderBy,
      sortOrder: query.sortOrder,
      userId: query.userId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      tags: query.tags,
      search: query.search,
    };

    const result = await this.repository.findMany(filter);

    return {
      ...result,
      data: result.data.map((product) => ({
        ...product,
        likeCount: product._count.likes,
        commentCount: product._count.comments,
      })),
    };
  }

  async getProductById(id: number) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      likeCount: product._count.likes,
      commentCount: product._count.comments,
    };
  }

  async createProduct(data: CreateProductInput) {
    const product = await this.repository.create(data);
    return {
      ...product,
      likeCount: product._count.likes,
      commentCount: product._count.comments,
    };
  }

  async updateProduct(id: number, data: UpdateProductInput, userId: number) {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 상품을 수정할 권한이 없습니다.');
    }

    const product = await this.repository.update(id, data);
    return {
      ...product,
      likeCount: product._count.likes,
      commentCount: product._count.comments,
    };
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const isOwner = await this.repository.isOwner(id, userId);
    if (!isOwner) {
      throw new Error('해당 상품을 삭제할 권한이 없습니다.');
    }

    await this.repository.delete(id);
  }

  async toggleLike(productId: number, userId: number): Promise<{ liked: boolean }> {
    const isLiked = await this.repository.checkLike(userId, productId);

    if (isLiked) {
      await this.repository.removeLike(userId, productId);
      return { liked: false };
    } else {
      await this.repository.addLike(userId, productId);
      return { liked: true };
    }
  }
}
