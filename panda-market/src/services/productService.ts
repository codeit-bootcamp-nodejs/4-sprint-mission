import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/lib/errors.js';
import type { GetListParams } from '@/types/shared.type.js';
import type { ProductRepository } from '@/repositories/products.repository.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';
import {
  PatchProductDTO,
  PostProductDTO,
  ProductParams,
} from '@/dto/products.dto.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { TagRepository } from '@/repositories/tags.repository.js';
import { ProductLikeRepository } from '@/repositories/product-likes.repository.js';
import {
  deleteCloudinaryFile,
  extractPublicIdFromCloudinaryUrl,
} from '../lib/cloudinary.js';
import { ProductImageRepository } from '@/repositories/product-images.repository.js';

@injectable()
export class ProductService {
  constructor(
    @inject(TYPES.ProductRepository)
    private readonly productRepository: ProductRepository,
    @inject(TYPES.PrismaClient)
    private readonly prisma: PrismaClient,
    @inject(TYPES.TagRepository)
    private readonly tagRepository: TagRepository,
    @inject(TYPES.ProductLikeRepository)
    private readonly productLikeRepository: ProductLikeRepository,
    @inject(TYPES.ProductImageRepository)
    private readonly productImageRepository: ProductImageRepository,
  ) {}
  async authorization({ userId, productId }: ProductParams): Promise<boolean> {
    const product = await this.productRepository.findOwnerById({ productId });
    return product.userId === userId;
  }

  async getProductList({ keyword, page, pageSize, userId }: GetListParams) {
    const products = await this.productRepository.findMany({
      keyword,
      page,
      pageSize,
      userId,
    });
    const results = products.map((product) => {
      const { likes, ...filteredProduct } = product;
      return {
        isLike: userId ? likes.length > 0 : false,
        ...filteredProduct,
      };
    });
    console.log(results);
    return results;
  }

  async getProduct({ productId, userId }: ProductParams) {
    const product = await this.productRepository.findById({
      productId,
      userId,
    });
    const { likes, ...filteredProduct } = product;
    const result = {
      isLike: userId ? likes.length > 0 : false,
      ...filteredProduct,
    };
    return result;
  }

  async postProduct({ userId, data }: PostProductDTO) {
    const { tags, imageUrls, ...restData } = data;
    const parsedTags = tags.map((tag) => {
      return {
        where: { name: tag },
        create: { name: tag },
      };
    });
    const createData = {
      ...restData,
      user: {
        connect: {
          id: userId,
        },
      },
      tags: {
        connectOrCreate: parsedTags,
      },
    };
    return await this.prisma.$transaction(async (tx) => {
      const product = await this.productRepository.create({
        createData,
        tx,
      });
      await this.tagRepository.incrementCounts({ tags, tx });
      if (imageUrls && imageUrls.length > 0) {
        const imageData = imageUrls.map((imageUrl) => {
          return {
            publicId: extractPublicIdFromCloudinaryUrl(imageUrl),
            url: imageUrl,
            productId: product.id,
          };
        });
        await this.productImageRepository.createMany({ imageData, tx });
      }
      return product;
    });
  }

  async patchProduct({ userId, productId, data }: PatchProductDTO) {
    if (await this.authorization({ userId, productId })) {
      const { tags: newTags, imageUrls: newImages, ...restData } = data;
      const patchData: Prisma.ProductUpdateInput = {
        ...restData,
      };
      let deletedImages: string[] = [];
      if (!newTags && !newImages) {
        if (Object.keys(patchData).length > 0) {
          return await this.productRepository.update({
            productId,
            patchData,
          });
        } else {
          throw new BadRequestError('수정할 상품 데이터가 없습니다.');
        }
      }
      // 태그 변동사항에 맞춰 태그 카운트 증가 혹은 감소 작업
      const updatedProduct = await this.prisma.$transaction(async (tx) => {
        if (newTags && newTags.length > 0) {
          const currentTags = await this.tagRepository.findMany({
            productId,
            tx,
          });
          // string[]을 Set으로 바꾸는 이유
          // 변경 목록 계산 시 string[]의 includes를 사용하면 배열의 모든 데이터를 순회함
          // Set은 해시테이블이라 해당 값만 바로 찾음
          // 사용하는 데이터가 태그들 유무 여부만 알면 되므로 Set을 사용하기 적절한거같음
          const currentTagSet = new Set(currentTags);
          const newTagSet = new Set(newTags);
          // 태그 변동 사항 반영
          const tagsToDecrement = currentTags.filter(
            (tag) => !newTagSet.has(tag),
          );
          const tagsToIncrement = newTags.filter(
            (tag) => !currentTagSet.has(tag),
          );
          patchData.tags = {
            disconnect: tagsToDecrement.map((name) => ({ name })),
            connectOrCreate: tagsToIncrement.map((name) => ({
              where: { name },
              create: { name },
            })),
          };
          // 태그 카운트 증가 혹은 감소
          if (tagsToDecrement.length > 0) {
            await this.tagRepository.decrementCounts({
              tags: tagsToDecrement,
              tx,
            });
          }
          if (tagsToIncrement.length > 0) {
            await this.tagRepository.incrementCounts({
              tags: tagsToIncrement,
              tx,
            });
          }
        }
        // 이미지 변경시
        if (newImages && newImages.length > 0) {
          const images = await this.productImageRepository.findMany({
            productId,
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
          deletedImages = images
            .filter((img) => !newImageSet.has(img.publicId))
            .map((img) => img.publicId);
          // 새로 생성할 이미지들
          const imagesToCreate = newImages.filter(
            (url) => !imageSet.has(extractPublicIdFromCloudinaryUrl(url)),
          );
          patchData.images = {
            deleteMany: imagesToDelete,
            create: imagesToCreate.map((url) => ({
              url: url,
              publicId: extractPublicIdFromCloudinaryUrl(url),
            })),
          };
        }
        await this.productRepository.update({
          productId,
          patchData,
          tx,
        });

        return this.productRepository.findById({ productId, userId, tx });
      });
      if (deletedImages.length > 0) {
        // 클라우디너리 이미지 삭제
        await Promise.all(
          deletedImages.map(async (publicId) => deleteCloudinaryFile(publicId)),
        );
      }

      return updatedProduct;
    } else {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }
  }

  async deleteProduct({ userId, productId }: ProductParams) {
    if (await this.authorization({ userId, productId })) {
      let imageIdsToDelete: string[] = [];
      const deletedProduct = await this.prisma.$transaction(async (tx) => {
        const tags = await this.tagRepository.findMany({ productId, tx });
        if (tags.length > 0) {
          await this.tagRepository.decrementCounts({ tags, tx });
        }
        const images = await this.productImageRepository.findMany({
          productId,
          tx,
        });
        if (images.length > 0) {
          imageIdsToDelete = images.map((img) => img.publicId);
        }
        const deletedProduct = await this.productRepository.delete({
          productId,
          tx,
        });
        return deletedProduct;
      });

      if (imageIdsToDelete.length > 0) {
        await Promise.all(
          imageIdsToDelete.map((publicId) => deleteCloudinaryFile(publicId)),
        );
      }
      return deletedProduct;
    } else {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }
  }

  async postProductLike({ userId, productId }: ProductParams) {
    return await this.prisma.$transaction(async (tx) => {
      const existingLike = await this.productLikeRepository.findById({
        userId,
        productId,
        tx,
      });
      if (!existingLike) {
        await this.productLikeRepository.create({
          userId,
          productId,
          tx,
        });
        const patchData: Prisma.ProductUpdateInput = {
          likeCount: {
            increment: 1,
          },
        };
        await this.productRepository.update({
          productId,
          patchData,
          tx,
        });
      }
      return this.productRepository.findById({ productId, userId, tx });
    });
  }

  async deleteProductLike({ userId, productId }: ProductParams) {
    return await this.prisma.$transaction(async (tx) => {
      const deleteLike = await this.productLikeRepository.delete({
        userId,
        productId,
        tx,
      });
      if (!deleteLike) {
        throw new NotFoundError('이미 좋아요 취소된 상품입니다.');
      }
      const patchData: Prisma.ProductUpdateInput = {
        likeCount: {
          decrement: 1,
        },
      };
      await this.productRepository.update({
        productId,
        patchData,
        tx,
      });
      return this.productRepository.findById({ productId, userId, tx });
    });
  }
}
