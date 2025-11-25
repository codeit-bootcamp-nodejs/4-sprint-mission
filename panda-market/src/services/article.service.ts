import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/lib/errors.js';
import type { ArticleParams, AuthArticleParams } from '@/dto/articles.dto.js';
import type { GetListParams } from '@/types/shared.types.js';
import type { ArticleRepository } from '@/repositories/articles.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { PatchArticleDTO, PostArticleDTO } from '@/dto/articles.dto.js';
import { ArticleImageRepository } from '@/repositories/article-images.repository.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { ImageUpdateInput } from '@/types/article.types.js';
import {
  buildUpdateImageQuery,
  deleteImageFile,
  getImageInfo,
} from '@/utils/image.utils.js';

@injectable()
export class ArticleService {
  constructor(
    @inject(TYPES.ArticleRepository)
    private readonly articleRepository: ArticleRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
    @inject(TYPES.ArticleImageRepository)
    private readonly articleImageRepository: ArticleImageRepository,
  ) {}

  private async authorization({
    userId,
    articleId,
  }: AuthArticleParams): Promise<boolean> {
    const article = await this.articleRepository.findOwnerById({ articleId });
    if (!article) {
      throw new NotFoundError();
    }
    return article.userId === userId;
  }
  private async imageUpdate({ articleId, tx, newImages }: ImageUpdateInput) {
    const images = await this.articleImageRepository.findMany({
      articleId,
      tx,
    });
    return buildUpdateImageQuery({ images, newImages });
  }

  async getArticleList({
    keyword,
    page,
    pageSize,
    orderBy,
    userId,
  }: GetListParams) {
    const articles = await this.articleRepository.findMany({
      keyword,
      page,
      pageSize,
      orderBy,
      userId,
    });
    const results = articles.map((article) => {
      const { likes, ...filteredArticle } = article;
      return {
        isLike: userId ? likes.length > 0 : false,
        ...filteredArticle,
      };
    });
    return results;
  }
  async getArticle({ articleId, userId }: ArticleParams) {
    const article = await this.articleRepository.findById({
      articleId,
      userId,
    });
    const { likes, ...filteredArticle } = article;
    const result = {
      isLike: userId ? likes.length > 0 : false,
      ...filteredArticle,
    };
    return result;
  }

  async postArticle({ userId, data }: PostArticleDTO) {
    const { imageUrls, ...restData } = data;
    const createData = {
      ...restData,
      user: {
        connect: {
          id: userId,
        },
      },
    };
    return await this.prisma.$transaction(async (tx) => {
      const article = await this.articleRepository.create({
        createData,
        tx,
      });
      if (imageUrls && imageUrls.length > 0) {
        const imageData = imageUrls.map((imageUrl) => {
          const { url, publicId } = getImageInfo(imageUrl);
          return {
            publicId,
            url,
            articleId: article.id,
          };
        });
        await this.articleImageRepository.createMany({ imageData, tx });
      }
      return await this.articleRepository.findById({
        articleId: article.id,
        tx,
      });
    });
  }
  async patchArticle({ articleId, userId, data }: PatchArticleDTO) {
    if (await this.authorization({ userId, articleId })) {
      const { imageUrls: newImages, ...restData } = data;
      const patchData: Prisma.ArticleUpdateInput = {
        ...restData,
      };
      let deletedImages: { publicId: string; storageType: string }[] = [];
      if (!newImages) {
        if (Object.keys(patchData).length > 0) {
          return await this.articleRepository.update({
            articleId,
            patchData,
          });
        } else {
          throw new BadRequestError('수정할 게시글 데이터가 없습니다.');
        }
      }
      const updatedArticle = await this.prisma.$transaction(async (tx) => {
        if (newImages !== undefined) {
          const result = await this.imageUpdate({
            tx,
            articleId,
            newImages,
          });
          deletedImages = result.imagesToDelete;
          patchData.images = result.query;
        }
        await this.articleRepository.update({
          articleId,
          patchData,
          tx,
        });
        return this.articleRepository.findById({ articleId, userId, tx });
      });
      if (deletedImages.length > 0) {
        // 클라우디너리 이미지 삭제
        await Promise.all(
          deletedImages.map((img) =>
            deleteImageFile({
              publicId: img.publicId,
              storageType: img.storageType,
            }),
          ),
        );
      }

      return updatedArticle;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteArticle({ articleId, userId }: AuthArticleParams) {
    if (await this.authorization({ userId, articleId })) {
      let imagesToDelete: { publicId: string; storageType: string }[] = [];
      const deletedArticle = await this.prisma.$transaction(async (tx) => {
        const images = await this.articleImageRepository.findMany({
          articleId,
          tx,
        });
        if (images.length > 0) {
          imagesToDelete = images.map((image) => {
            const { publicId, storageType } = getImageInfo(image.url);
            return {
              publicId,
              storageType,
            };
          });
          await this.articleImageRepository.deleteMany({
            articleId,
            tx,
          });
        }
        const deleteArticle = await this.articleRepository.delete({
          articleId,
          tx,
        });
        return deleteArticle;
      });

      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((img) =>
            deleteImageFile({
              publicId: img.publicId,
              storageType: img.storageType,
            }),
          ),
        );
      }
      return deletedArticle;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
