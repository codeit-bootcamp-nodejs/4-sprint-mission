import { PrismaClient } from '@prisma/client';
import {
  UserRepository,
  ProductRepository,
  ArticleRepository,
  CommentRepository,
  LikeRepository,
} from '../repositories/index.js';
import {
  UserService,
  ProductService,
  ArticleService,
  CommentService,
} from './index.js';

export class ServiceContainer {
  private prisma: PrismaClient;

  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private articleRepository: ArticleRepository;
  private commentRepository: CommentRepository;
  private likeRepository: LikeRepository;

  private userService: UserService;
  private productService: ProductService;
  private articleService: ArticleService;
  private commentService: CommentService;

  constructor() {
    this.prisma = new PrismaClient();

    this.userRepository = new UserRepository(this.prisma);
    this.productRepository = new ProductRepository(this.prisma);
    this.articleRepository = new ArticleRepository(this.prisma);
    this.commentRepository = new CommentRepository(this.prisma);
    this.likeRepository = new LikeRepository(this.prisma);

    this.userService = new UserService(this.userRepository);
    this.productService = new ProductService(this.productRepository, this.likeRepository);
    this.articleService = new ArticleService(this.articleRepository, this.likeRepository);
    this.commentService = new CommentService(this.commentRepository);
  }

  getUserService(): UserService {
    return this.userService;
  }

  getProductService(): ProductService {
    return this.productService;
  }

  getArticleService(): ArticleService {
    return this.articleService;
  }

  getCommentService(): CommentService {
    return this.commentService;
  }

  getProductRepository(): ProductRepository {
    return this.productRepository;
  }

  getArticleRepository(): ArticleRepository {
    return this.articleRepository;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const serviceContainer = new ServiceContainer();