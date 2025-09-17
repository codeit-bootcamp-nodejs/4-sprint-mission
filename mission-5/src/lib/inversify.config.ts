import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/layer.types.js';
import prisma from './prisma.js';
import { UserRepository } from '../repositories/users.repository.js';
import { ArticleRepository } from '../repositories/articles.repository.js';
import { ProductRepository } from '../repositories/products.repository.js';
import { CommentRepository } from '../repositories/comments.repository.js';
import { FileRepository } from '../repositories/files.repository.js';
import { AuthRepository } from '../repositories/auths.repository.js';
import { UserService } from '../services/userService.js';
import { ProductService } from '../services/productService.js';
import { CommentService } from '../services/commentService.js';
import { FileService } from '../services/fileService.js';
import { AuthService } from '../services/authService.js';
import { ArticleService } from '../services/articleService.js';
import { UserController } from '../controllers/userController.js';
import { ProductController } from '../controllers/productController.js';
import { CommentController } from '../controllers/commentController.js';
import { FileController } from '../controllers/fileController.js';
import { AuthController } from '../controllers/authController.js';
import { ArticleController } from '../controllers/articleController.js';

const container = new Container();

container.bind(TYPES.PrismaClient).toConstantValue(prisma);

// repositories
container.bind(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.ProductRepository).to(ProductRepository).inSingletonScope();
container.bind(TYPES.CommentRepository).to(CommentRepository).inSingletonScope();
container.bind(TYPES.FileRepository).to(FileRepository).inSingletonScope();
container.bind(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind(TYPES.ArticleRepository).to(ArticleRepository).inSingletonScope();

// services
container.bind(TYPES.UserService).to(UserService).inSingletonScope();
container.bind(TYPES.ProductService).to(ProductService).inSingletonScope();
container.bind(TYPES.CommentService).to(CommentService).inSingletonScope();
container.bind(TYPES.FileService).to(FileService).inSingletonScope();
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind(TYPES.ArticleService).to(ArticleService).inSingletonScope();

// controllers
container.bind(TYPES.UserController).to(UserController).inSingletonScope();
container.bind(TYPES.ProductController).to(ProductController).inSingletonScope();
container.bind(TYPES.CommentController).to(CommentController).inSingletonScope();
container.bind(TYPES.FileController).to(FileController).inSingletonScope();
container.bind(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind(TYPES.ArticleController).to(ArticleController).inSingletonScope();

export default container;
