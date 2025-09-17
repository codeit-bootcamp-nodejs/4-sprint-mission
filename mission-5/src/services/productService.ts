import { ForbiddenError } from '@/lib/errors.js';
import type { PatchProduct, PostProduct, ProductParams } from '@/types/product.types.js';
import type { GetListParams } from '@/types/shared.type.js';
import type { ProductRepository } from '@/repositories/products.repository.js';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async authorization({ userId, productId }: ProductParams): Promise<boolean> {
    const product = await this.productRepository.findOwnerById({ productId });
    return product.userId === userId;
  }

  // prettier-ignore
  async getProductList({ keyword, page, pageSize, userId }: GetListParams) {
      const products = await this.productRepository.findMany({ keyword, page, pageSize, userId })
      const results = products.map((product) => {
        const { likes: _likes, _count, ...filteredProduct } = product;
        return {
          likeCount: product._count.likes,
          isLike: userId ? product.likes.length === 1 : false,
          ...filteredProduct,
        };
      });
      return results;
  }

  async postProduct({ userId, name, description, price, tags }: PostProduct) {
    const product = await this.productRepository.create({ userId, name, description, price, tags });
    return product;
  }

  async getProduct({ productId, userId }: ProductParams) {
    const product = await this.productRepository.findById({ productId, userId });
    const { likes: _likes, _count, ...filteredProduct } = product;
    const result = {
      likeCount: product._count.likes,
      isLike: userId ? product.likes.length === 1 : false,
      ...filteredProduct,
    };
    return result;
  }

  async patchProduct({ userId, productId, data }: PatchProduct) {
    if (await this.authorization({ userId, productId })) {
      const product = await this.productRepository.update({ productId, data });
      return product;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteProduct({ userId, productId }: ProductParams) {
    if (await this.authorization({ userId, productId })) {
      const product = await this.productRepository.delete({ productId });
      return product;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }

  async postProductLike({ userId, productId }: ProductParams) {
    const product = await this.productRepository.like({ userId, productId });
    return product;
  }

  async deleteProductLike({ userId, productId }: ProductParams) {
    const product = await this.productRepository.unlike({ userId, productId });
    return product;
  }
}
