import { PrismaClient } from "@prisma/client";
import {
  ProductController,
  ArticleController,
  CommentController,
  ImageController,
  UserController,
  NotificationController,
} from "./controller";

import {
  ProductService,
  ArticleService,
  CommentService,
  UserService,
  LikeService,
  NotificationService,
} from "./service";

import {
  ProductRepository,
  ArticleRepository,
  CommentRepository,
  UserRepository,
  LikeRepository,
  NotificationRepository,
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
const notificationRepository = new NotificationRepository(prisma);

// Service
const productService = new ProductService(productRepository);
const articleService = new ArticleService(articleRepository, prisma);
const userService = new UserService(userRepository, productRepository);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository
);

// Controller
const productController = new ProductController(productService, likeService);
const articleController = new ArticleController(articleService, likeService);
const imageController = new ImageController();
const userController = new UserController(userService);

// Middleware
const validationMiddleware = new ValidationMiddleware();
const imageMiddleware = new ImageMiddleware();

const container = {
  productController,
  articleController,
  imageController,
  userController,
  validationMiddleware,
  imageMiddleware,
  likeService,

  // io와 Notification 관련 객체들을 관리
  io: null as Server | null,
  productRepository,
  articleRepository,
  commentRepository,
  userRepository,
  likeRepository,
  notificationRepository,

  // Service와 Controller는 io 객체가 설정된 후에 생성되도록 getter로 만듦
  _notificationService: null as NotificationService | null,
  get notificationService(): NotificationService {
    if (!this.io) {
      throw new Error("Socket.IO (io) is not initialized.");
    }
    if (!this._notificationService) {
      this._notificationService = new NotificationService(
        this.notificationRepository,
        this.io
      );
    }
    return this._notificationService;
  },

  _notificationController: null as NotificationController | null,
  get notificationController(): NotificationController {
    if (!this._notificationController) {
      this._notificationController = new NotificationController(
        this.notificationService // service getter를 호출
      );
    }
    return this._notificationController;
  },

  _commentService: null as CommentService | null,
  get commentService(): CommentService {
    if (!this._commentService) {
      this._commentService = new CommentService(
        this.commentRepository,
        this.articleRepository,
        this.notificationService
      );
    }
    return this._commentService;
  },

  _commentController: null as CommentController | null,
  get commentController(): CommentController {
    if (!this._commentController) {
      this._commentController = new CommentController(this.commentService);
    }
    return this._commentController;
  },
};

export default container;
