import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import * as productsRepository from '../repositories/productsRepository';
import * as notificationsService from './notificationsService';
import { prismaClient } from '../lib/prismaClient';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';

type CreateProductData = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'
>;
type UpdateProductData = Partial<CreateProductData> & { userId: number };

export async function createProduct(data: CreateProductData): Promise<Product> {
  const createdProduct = await productsRepository.createProduct(data);
  return {
    ...createdProduct,
    favoriteCount: 0,
    isFavorited: false,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await productsRepository.getProductWithFavorites(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return product;
}

export async function getProductList(
  params: PagePaginationParams,
  { userId }: { userId?: number } = {},
): Promise<PagePaginationResult<Product>> {
  const products = await productsRepository.getProductListWithFavorites(params, { userId });
  return products;
}

export async function updateProduct(id: number, data: UpdateProductData): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  // 가격 변경 여부 확인
  const priceChanged = data.price !== undefined && data.price !== existingProduct.price;
  let favoriteUserIds: number[] = [];

  if (priceChanged) {
    // 이 상품을 찜한 사용자들 조회
    const favorites = await prismaClient.favorite.findMany({
      where: { productId: id },
      select: { userId: true },
    });
    favoriteUserIds = favorites.map((fav) => fav.userId).filter((uid) => uid !== data.userId);
  }

  // 상품 업데이트
  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);

  // 알림 전송 (비동기, 별도 처리)
  if (priceChanged && favoriteUserIds.length > 0) {
    Promise.all(
      favoriteUserIds.map((favoriteUserId) =>
        notificationsService.createAndSendNotification({
          type: 'PRICE_CHANGE',
          message: `찜한 상품 "${updatedProduct.name}"의 가격이 변경되었습니다.`,
          userId: favoriteUserId,
          productId: id,
        })
      )
    ).catch((error) => {
      console.error('Failed to send price change notifications:', error);
    });
  }

  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
