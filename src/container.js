import { PrismaClient } from '@prisma/client';
import {
  ProductController,
  ArticleController,
  CommentController,
} from './controller/index.js';
import {
  ProductService,
  ArticleService,
  CommentService,
} from './service/index.js';
import {
  ProductRepository,
  ArticleRepository,
  CommentRepository,
} from './repository/index.js';

const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립

// Repository
const productRepository = new ProductRepository(prisma);
const articleRepository = new ArticleRepository(prisma);
const commentRepository = new CommentRepository(prisma);

// Service
const productService = new ProductService(productRepository, prisma);
const articleService = new ArticleService(articleRepository, prisma);
const commentService = new CommentService(commentRepository, prisma);

// controller
const productController = new ProductController(productService);
const articleController = new ArticleController(articleService);
const commentController = new CommentController(commentService);

export default {
  productController,
  articleController,
  commentController,
};
