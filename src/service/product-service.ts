import { ProductRepository } from '../repository/product-repository';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  createProduct = async (
    userId: number,
    name: string,
    description: string,
    price: number,
    tags: string[],
  ) => {
    return await this.productRepository.createProduct(
      userId,
      name,
      description,
      price,
      tags,
    );
  };

  getProducts = async (
    page: number,
    limit: number,
    search: string | undefined,
    userId: number | undefined,
  ) => {
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};
    const offset = (page - 1) * limit;

    const products = await this.productRepository.findManyProducts(
      whereCondition,
      offset,
      limit,
      userId,
    );
    const totalCount =
      await this.productRepository.countProducts(whereCondition);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: products,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  getProductById = async (productId: string, userId: number | undefined) => {
    const product = await this.productRepository.findProductById(
      productId,
      userId,
    );
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    return product;
  };

  updateProduct = async (
    userId: number,
    productId: string,
    productData: {
      name?: string;
      description?: string;
      price?: number;
      tags?: string[];
    },
  ) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    if (product.userId !== userId) {
      throw new Error('상품을 수정할 권한이 없습니다.');
    }

    const { name, description, price, tags } = productData;
    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = price;
    if (tags !== undefined) dataToUpdate.tags = tags;

    return await this.productRepository.updateProduct(productId, dataToUpdate);
  };

  deleteProduct = async (userId: number, productId: string) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    if (product.userId !== userId) {
      throw new Error('상품을 삭제할 권한이 없습니다.');
    }
    await this.productRepository.deleteProduct(productId);
  };
}