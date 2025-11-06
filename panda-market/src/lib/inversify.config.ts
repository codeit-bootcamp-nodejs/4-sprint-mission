import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/types/layer.types.js';
import prisma from './prisma.js';
import { UserRepository } from '@/repositories/users.repository.js';
import { ArticleRepository } from '@/repositories/articles.repository.js';
import { ProductRepository } from '@/repositories/products.repository.js';
import { AuthRepository } from '@/repositories/auths.repository.js';
import { UserService } from '@/services/user.service.js';
import { ProductService } from '@/services/product.service.js';
import { ImageService } from '@/services/image.service.js';
import { AuthService } from '@/services/auth.service.js';
import { ArticleService } from '@/services/article.service.js';
import { UserController } from '@/controllers/user.controller.js';
import { ProductController } from '@/controllers/product.controller.js';
import { ImageController } from '@/controllers/image.controller.js';
import { AuthController } from '@/controllers/auth.controller.js';
import { ArticleController } from '@/controllers/article.controller.js';
import { TagRepository } from '@/repositories/tags.repository.js';
import { ProductLikeRepository } from '@/repositories/product-likes.repository.js';
import { ProductImageRepository } from '@/repositories/product-images.repository.js';
import { ProductLikeService } from '@/services/product-like.service.js';
import { ArticleImageRepository } from '@/repositories/article-images.repository.js';
import { ArticleLikeRepository } from '@/repositories/article-likes.repository.js';
import { ArticleLikeService } from '@/services/article-like.service.js';
import { ProductCommentService } from '@/services/product-comment.service.js';
import { ProductCommentController } from '@/controllers/product-comments.controller.js';
import { ProductCommentRepository } from '@/repositories/product-comments.repository.js';
import { ArticleCommentController } from '@/controllers/article-comments.controller.js';
import { ArticleCommentService } from '@/services/article-comment.service.js';
import { ArticleCommentRepository } from '@/repositories/article-comments.repository.js';

const container = new Container();

container.bind(TYPES.PrismaClient).toConstantValue(prisma);

// repositories
container.bind(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.ProductRepository).to(ProductRepository).inSingletonScope();
container.bind(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind(TYPES.ArticleRepository).to(ArticleRepository).inSingletonScope();
container.bind(TYPES.TagRepository).to(TagRepository).inSingletonScope();
container.bind(TYPES.ProductLikeRepository).to(ProductLikeRepository).inSingletonScope();
container.bind(TYPES.ProductImageRepository).to(ProductImageRepository).inSingletonScope();
container.bind(TYPES.ArticleImageRepository).to(ArticleImageRepository).inSingletonScope();
container.bind(TYPES.ArticleLikeRepository).to(ArticleLikeRepository).inSingletonScope();
container.bind(TYPES.ProductCommentRepository).to(ProductCommentRepository).inSingletonScope();
container.bind(TYPES.ArticleCommentRepository).to(ArticleCommentRepository).inSingletonScope();

// services
container.bind(TYPES.UserService).to(UserService).inSingletonScope();
container.bind(TYPES.ProductService).to(ProductService).inSingletonScope();
container.bind(TYPES.ImageService).to(ImageService).inSingletonScope();
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind(TYPES.ArticleService).to(ArticleService).inSingletonScope();
container.bind(TYPES.ProductLikeService).to(ProductLikeService).inSingletonScope();
container.bind(TYPES.ArticleLikeService).to(ArticleLikeService).inSingletonScope();
container.bind(TYPES.ProductCommentService).to(ProductCommentService).inSingletonScope();
container.bind(TYPES.ArticleCommentService).to(ArticleCommentService).inSingletonScope();

// controllers
container.bind(TYPES.UserController).to(UserController).inSingletonScope();
container.bind(TYPES.ProductController).to(ProductController).inSingletonScope();
container.bind(TYPES.ProductCommentController).to(ProductCommentController).inSingletonScope();
container.bind(TYPES.ArticleCommentController).to(ArticleCommentController).inSingletonScope();
container.bind(TYPES.ImageController).to(ImageController).inSingletonScope();
container.bind(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind(TYPES.ArticleController).to(ArticleController).inSingletonScope();

export default container;
