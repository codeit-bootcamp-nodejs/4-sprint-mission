import prisma from '../index';
import { Product as PrismaProduct, Prisma } from '@prisma/client';

class ProductRepository {
  async findProductById(id: number): Promise<PrismaProduct | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findProducts(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<PrismaProduct[]> {
    return prisma.product.findMany(options);
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<PrismaProduct> {
    return prisma.product.create({ data });
  }

  async updateProduct(id: number, data: Prisma.ProductUpdateInput): Promise<PrismaProduct> {
    return prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number): Promise<PrismaProduct> {
    return prisma.product.delete({ where: { id } });
  }
}

export default ProductRepository;
