import { ArticleRepository } from '@/repositories/articles.repository.js';
import { AuthRepository } from '@/repositories/auths.repository.js';
import { CommentRepository } from '@/repositories/comments.repository.js';
import { FileRepository } from '@/repositories/files.repository.js';
import { ProductRepository } from '@/repositories/products.repository.js';
import { UserRepository } from '@/repositories/users.repository.js';
import prisma from './prisma.js';
import { ArticleService } from '@services/articleService.js';
import { ProductService } from '@services/productService.js';
import { CommentService } from '@services/commentService.js';
import { AuthService } from '@services/authService.js';
import { FileService } from '@services/fileService.js';
import { UserService } from '@services/userService.js';
import { ArticleController } from '@controllers/articleController.js';
import { ProductController } from '@controllers/productController.js';
import { CommentController } from '@controllers/commentController.js';
import { AuthController } from '@controllers/authController.js';
import { FileController } from '@controllers/fileController.js';
import { UserController } from '@controllers/userController.js';

// repository 의존성 주입
const articleRepository = new ArticleRepository(prisma);
const productRepository = new ProductRepository(prisma);
const commentRepository = new CommentRepository(prisma);
const authRepository = new AuthRepository(prisma);
const fileRepository = new FileRepository(prisma);
const userRepository = new UserRepository(prisma);

// service 의존성 주입
const articleService = new ArticleService(articleRepository);
const productService = new ProductService(productRepository);
const commentService = new CommentService(commentRepository);
const authService = new AuthService(authRepository);
const fileService = new FileService(fileRepository);
const userService = new UserService(userRepository);

// controller 의존성 주입
export const articleController = new ArticleController(articleService);
export const productController = new ProductController(productService);
export const commentController = new CommentController(commentService);
export const authController = new AuthController(authService);
export const fileController = new FileController(fileService);
export const userController = new UserController(userService);
