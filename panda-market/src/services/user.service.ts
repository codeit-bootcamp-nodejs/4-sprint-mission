import { Prisma } from '@prisma/client';
import { validatePassword, passwordHashing } from '@/lib/bcrypt.js';
import { UnauthorizedError } from '@/lib/errors.js';
import type { UserId } from '@/types/user.types.js';
import type { UserRepository } from '@/repositories/users.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { ProductLikeRepository } from '@/repositories/product-likes.repository.js';
import { ProductRepository } from '@/repositories/products.repository.js';
import { ArticleRepository } from '@/repositories/articles.repository.js';
import { ArticleLikeRepository } from '@/repositories/article-likes.repository.js';
import { ProductCommentRepository } from '@/repositories/product-comments.repository.js';
import { ArticleCommentRepository } from '@/repositories/article-comments.repository.js';
import { buildContentList } from '@/utils/content.mapper.js';
import {
  deleteCloudinaryFile,
  extractPublicIdFromCloudinaryUrl,
} from '@/lib/cloudinary.js';
import { PatchUserParams } from '@/dto/users.dto.js';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.ProductRepository)
    private readonly productRepository: ProductRepository,
    @inject(TYPES.ArticleRepository)
    private readonly articleRepository: ArticleRepository,
    @inject(TYPES.ProductLikeRepository)
    private readonly productLikeRepository: ProductLikeRepository,
    @inject(TYPES.ArticleLikeRepository)
    private readonly articleLikeRepository: ArticleLikeRepository,
    @inject(TYPES.ProductCommentRepository)
    private readonly productCommentRepository: ProductCommentRepository,
    @inject(TYPES.ArticleCommentRepository)
    private readonly articleCommentRepository: ArticleCommentRepository,
  ) {}
  async getUser({ userId }: UserId) {
    const result = await this.userRepository.findById({ userId });
    return result;
  }
  async patchUser({ userId, data }: PatchUserParams) {
    const { changePassword, currentPassword, imageUrl, ...restData } = data;
    const updateData: Prisma.UserUpdateInput = { ...restData };
    let oldPublicId: string | null = null;
    if (imageUrl) {
      const currentUser = await this.userRepository.findById({ userId });
      oldPublicId = currentUser.imagePublicId;
      const newPublicId = extractPublicIdFromCloudinaryUrl(imageUrl);
      updateData.imagePublicId = newPublicId;
    }
    if (changePassword && currentPassword) {
      // 비밀번호 변경시에만 실행
      const user = await this.userRepository.findPasswordById({ userId });
      if (!user.password) {
        throw new UnauthorizedError('간편 로그인 회원입니다.');
      }
      if (await validatePassword(currentPassword, user.password)) {
        updateData['password'] = await passwordHashing(changePassword);
      } else {
        throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
      }
    }
    const result = await this.userRepository.update({ userId, updateData });
    if (oldPublicId && oldPublicId !== result.imagePublicId) {
      // 프로필 이미지 변경된 경우
      await deleteCloudinaryFile(oldPublicId);
    }
    return result;
  }
  async deleteUser({ userId }: UserId) {
    const result = await this.userRepository.delete({ userId });
    return result;
  }
  async getUserProductList({ userId }: UserId) {
    const userProduct = await this.productRepository.findManyByUserId({
      userId,
    });
    return buildContentList({
      userId,
      contents: userProduct,
    });
  }
  async getUserArticleList({ userId }: UserId) {
    const userArticle = await this.articleRepository.findManyByUserId({
      userId,
    });
    return buildContentList({
      userId,
      contents: userArticle,
    });
  }
  async getUserProductCommentList({ userId }: UserId) {
    return await this.productCommentRepository.findManyByUserId({
      userId,
    });
  }
  async getUserArticleCommentList({ userId }: UserId) {
    return await this.articleCommentRepository.findManyByUserId({
      userId,
    });
  }
  async getUserProductLikeList({ userId }: UserId) {
    return await this.productLikeRepository.findManyByUserId({
      userId,
    });
  }
  async getUserArticleLikeList({ userId }: UserId) {
    return await this.articleLikeRepository.findManyByUserId({
      userId,
    });
  }
}
