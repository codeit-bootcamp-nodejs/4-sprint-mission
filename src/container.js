import { PrismaClient } from '@prisma/client';
import {
  ProductController,
  ArticleController,
  CommentController,
  ImageController,
  UserController,
} from './controller/index.js';

import {
  ProductService,
  ArticleService,
  CommentService,
  UserService,
} from './service/index.js';

import {
  ProductRepository,
  ArticleRepository,
  CommentRepository,
  UserRepository,
} from './repository/index.js';

import {
  ValidationMiddleware,
  ImageMiddleware,
} from './middleware/validation-middleware.js';

const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립

// Repository
const productRepository = new ProductRepository(prisma);
const articleRepository = new ArticleRepository(prisma);
const commentRepository = new CommentRepository(prisma);
const userRepository = new UserRepository(prisma);

// Service
const productService = new ProductService(productRepository, prisma);
const articleService = new ArticleService(articleRepository, prisma);
const commentService = new CommentService(commentRepository, prisma);
const userService = new UserService(userRepository, productRepository, prisma);

// controller
const productController = new ProductController(productService);
const articleController = new ArticleController(articleService);
const commentController = new CommentController(commentService);
const imageController = new ImageController();
const userController = new UserController(userService);

// middleware
const validationMiddleware = new ValidationMiddleware();
const imageMiddleware = new ImageMiddleware();

export default {
  productController,
  articleController,
  commentController,
  imageController,
  userController,
  validationMiddleware,
  imageMiddleware,
};
