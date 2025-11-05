export const TYPES = {
  // Prisma
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ArticleRepository: Symbol.for('ArticleRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  CommentRepository: Symbol.for('CommentRepository'),
  AuthRepository: Symbol.for('AuthRepository'),
  TagRepository: Symbol.for('TagRepository'),
  ProductLikeRepository: Symbol.for('ProductLikeRepository'),
  ProductImageRepository: Symbol.for('ProductImageRepository'),
  ArticleImageRepository: Symbol.for('ArticleImageRepository'),
  ArticleLikeRepository: Symbol.for('ArticleLikeRepository'),
  ProductCommentRepository: Symbol.for('ProductCommentRepository'),
  ArticleCommentRepository: Symbol.for('ArticleCommentRepository'),

  // Services
  UserService: Symbol.for('UserService'),
  ArticleService: Symbol.for('ArticleService'),
  ProductService: Symbol.for('ProductService'),
  AuthService: Symbol.for('AuthService'),
  ImageService: Symbol.for('ImageService'),
  ProductLikeService: Symbol.for('ProductLikeService'),
  ArticleLikeService: Symbol.for('ArticleLikeService'),
  ProductCommentService: Symbol.for('ProductCommentService'),
  ArticleCommentService: Symbol.for('ArticleCommentService'),

  // Controllers
  UserController: Symbol.for('UserController'),
  ArticleController: Symbol.for('ArticleController'),
  ProductController: Symbol.for('ProductController'),
  ProductCommentController: Symbol.for('ProductCommentController'),
  ArticleCommentController: Symbol.for('ArticleCommentController'),
  AuthController: Symbol.for('AuthController'),
  ImageController: Symbol.for('ImageController'),
};
