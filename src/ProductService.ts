import { Product as PrismaProduct, Prisma } from '@prisma/client';
import ProductRepository from './repositories/ProductRepository';
import { ProductCreateDto, ProductUpdateDto } from './dtos/ProductDto';

interface ProductCreateServiceInput {
  name: string;
  content: string;
  price: number;
  userId: number;
  status?: string;
}

class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(data: ProductCreateServiceInput): Promise<PrismaProduct> {
    const { userId, ...rest } = data;
    return this.productRepository.createProduct({
      ...rest,
      user: { connect: { id: userId } },
    });
  }

  async getProductById(id: number): Promise<PrismaProduct | null> {
    return this.productRepository.findProductById(id);
  }

  async getProducts(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<PrismaProduct[]> {
    return this.productRepository.findProducts(options);
  }

  async updateProduct(id: number, data: ProductUpdateDto): Promise<PrismaProduct> {
    return this.productRepository.updateProduct(id, data);
  }

  async deleteProduct(id: number): Promise<PrismaProduct> {
    return this.productRepository.deleteProduct(id);
  }
}

export default ProductService;
