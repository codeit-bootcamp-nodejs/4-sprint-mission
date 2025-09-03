import { PrismaClient } from '@prisma/client';
import { ProductController, ArticleController } from './controller/index.js';
import { ProductService, ArticleService } from './service/index.js';
import { ProductRepository, ArticleRepository } from './repository/index.js';

const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립

// Repository
const productRepository = new ProductRepository(prisma);
const articleRepository = new ArticleRepository(prisma);

// Service
const productService = new ProductService(productRepository, prisma);
const articleService = new ArticleService(articleRepository, prisma);

// controller
const productController = new ProductController(productService);
const articleController = new ArticleController(articleService);

export default {
  productController,
  articleController,
};
