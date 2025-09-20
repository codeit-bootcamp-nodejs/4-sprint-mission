import { Prisma } from '@prisma/client';
import { ProductRepository } from '../repository/product-repository';
import { CreateProductDto, UpdateProductDto } from '../types/dto';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  createProduct = async (userId: number, createProductDto: CreateProductDto) => {
    const { name, description, price, tags } = createProductDto;
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
    const whereCondition: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
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
    updateProductDto: UpdateProductDto,
  ) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    if (product.userId !== userId) {
      throw new Error('상품을 수정할 권한이 없습니다.');
    }

    return await this.productRepository.updateProduct(
      productId,
      updateProductDto,
    );
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