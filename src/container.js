import { PrismaClient } from '@prisma/client';
import { ProductController } from './controller/index.js';
import { ProductService } from './service/index.js';
import { ProductRepository } from './repository/index.js';

const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립

// Repository
const productRepository = new ProductRepository(prisma);

// Service
const productService = new ProductService(productRepository, prisma);

// controller
const productController = new ProductController(productService);

export default {
  productController,
};
