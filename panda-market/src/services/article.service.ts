import { BadRequestError, ForbiddenError } from '@/lib/errors.js';
import type { ArticleParams, AuthArticleParams } from '@/dto/articles.dto.js';
import type { GetListParams } from '@/types/shared.types.js';
import type { ArticleRepository } from '@/repositories/articles.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import { PatchArticleDTO, PostArticleDTO } from '@/dto/articles.dto.js';
import { ArticleImageRepository } from '@/repositories/article-images.repository.js';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  deleteCloudinaryFile,
  extractPublicIdFromCloudinaryUrl,
} from '@/lib/cloudinary.js';
import { ImageUpdateInput } from '@/types/article.types.js';

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
    return article.userId === userId;
  }
  private async imageUpdate({ articleId, tx, newImages }: ImageUpdateInput) {
    const images = await this.articleImageRepository.findMany({
      articleId,
      tx,
    });
    const imageSet = new Set(images.map((img) => img.publicId));
    const newImageList = newImages.map((imageUrl) =>
      extractPublicIdFromCloudinaryUrl(imageUrl),
    );
    const newImageSet = new Set(newImageList);
    // 삭제할 이미지들
    const imagesToDelete = images
      .filter((img) => !newImageSet.has(img.publicId))
      .map((img) => ({ publicId: img.publicId }));
    const deletedImageIds = imagesToDelete.map((img) => img.publicId);
    // 새로 생성할 이미지들
    const imagesToCreate = newImages.filter(
      (url) => !imageSet.has(extractPublicIdFromCloudinaryUrl(url)),
    );
    return {
      deletedImageIds,
      query: {
        deleteMany: imagesToDelete,
        create: imagesToCreate.map((url) => ({
          url: url,
          publicId: extractPublicIdFromCloudinaryUrl(url),
        })),
      },
    };
  }

  async getArticleList({ keyword, page, pageSize, userId }: GetListParams) {
    const articles = await this.articleRepository.findMany({
      keyword,
      page,
      pageSize,
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
          return {
            publicId: extractPublicIdFromCloudinaryUrl(imageUrl),
            url: imageUrl,
            articleId: article.id,
          };
        });
        await this.articleImageRepository.createMany({ imageData, tx });
      }
      return article;
    });
  }
  async patchArticle({ articleId, userId, data }: PatchArticleDTO) {
    if (await this.authorization({ userId, articleId })) {
      const { imageUrls: newImages, ...restData } = data;
      const patchData: Prisma.ArticleUpdateInput = {
        ...restData,
      };
      let deletedImages: string[] = [];
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
          deletedImages = result.deletedImageIds;
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
          deletedImages.map(async (publicId) => deleteCloudinaryFile(publicId)),
        );
      }

      return updatedArticle;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteArticle({ articleId, userId }: AuthArticleParams) {
    if (await this.authorization({ userId, articleId })) {
      let imageIdsToDelete: string[] = [];
      const deletedArticle = await this.prisma.$transaction(async (tx) => {
        const images = await this.articleImageRepository.findMany({
          articleId,
          tx,
        });
        if (images.length > 0) {
          imageIdsToDelete = images.map((image) => image.publicId);
        }
        const deleteArticle = await this.articleRepository.delete({
          articleId,
          tx,
        });
        return deleteArticle;
      });

      if (imageIdsToDelete.length > 0) {
        await Promise.all(
          imageIdsToDelete.map((publicId) => deleteCloudinaryFile(publicId)),
        );
      }
      return deletedArticle;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }
}
