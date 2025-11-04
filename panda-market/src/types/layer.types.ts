export const TYPES = {
  // Prisma
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ArticleRepository: Symbol.for('ArticleRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  CommentRepository: Symbol.for('CommentRepository'),
  AuthRepository: Symbol.for('AuthRepository'),
  FileRepository: Symbol.for('FileRepository'),
  TagRepository: Symbol.for('TagRepository'),
  ProductLikeRepository: Symbol.for('ProductLikeRepository'),
  ProductImageRepository: Symbol.for('ProductImageRepository'),

  // Services
  UserService: Symbol.for('UserService'),
  ArticleService: Symbol.for('ArticleService'),
  ProductService: Symbol.for('ProductService'),
  CommentService: Symbol.for('CommentService'),
  AuthService: Symbol.for('AuthService'),
  FileService: Symbol.for('FileService'),
  ProductLikeService: Symbol.for('ProductLikeService'),

  // Controllers
  UserController: Symbol.for('UserController'),
  ArticleController: Symbol.for('ArticleController'),
  ProductController: Symbol.for('ProductController'),
  CommentController: Symbol.for('CommentController'),
  AuthController: Symbol.for('AuthController'),
  FileController: Symbol.for('FileController'),
};
