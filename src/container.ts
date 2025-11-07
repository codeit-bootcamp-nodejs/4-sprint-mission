import { PrismaClient } from "@prisma/client";
import {
  ProductController,
  ArticleController,
  CommentController,
  ImageController,
  UserController,
} from "./controller";

import {
  ProductService,
  ArticleService,
  CommentService,
  UserService,
  LikeService,
} from "./service";

import {
  ProductRepository,
  ArticleRepository,
  CommentRepository,
  UserRepository,
  LikeRepository,
} from "./repository";

import { ValidationMiddleware } from "./middleware/validation-middleware";
import { ImageMiddleware } from "./middleware/image-middleware";
import { Server } from "socket.io";

const prisma = new PrismaClient();

// Repository
const productRepository = new ProductRepository(prisma);
const articleRepository = new ArticleRepository(prisma);
const commentRepository = new CommentRepository(prisma);
const userRepository = new UserRepository(prisma);
const likeRepository = new LikeRepository(prisma);

// Service
const productService = new ProductService(productRepository);
const articleService = new ArticleService(articleRepository, prisma);
const commentService = new CommentService(commentRepository);
const userService = new UserService(userRepository, productRepository);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository
);

// Controller
const productController = new ProductController(productService, likeService);
const articleController = new ArticleController(articleService, likeService);
const commentController = new CommentController(commentService);
const imageController = new ImageController();
const userController = new UserController(userService);

// Middleware
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
  likeService,
  io: null as Server | null,
};
