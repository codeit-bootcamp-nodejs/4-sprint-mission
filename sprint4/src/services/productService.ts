// src/services/productService.ts
import * as productRepository from '../repositories/productRepository';
import { CreateProduct } from '../types';
export const getProductById = async (id: number) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  return product;
};

export const getProductWithLikeStatus = async (id: number, userId?: number) => {
  const product = await getProductById(id);

  let isLiked = false;
  if (userId) {
    const like = await productRepository.findProductLike(userId, id);
    isLiked = !!like;
  }

  return { product, isLiked };
};

export const getMyProducts = async (userId: number) => {
  return productRepository.findProductsByUserId(userId);
};

export const getLikedProducts = async (userId: number) => {
  const likedProducts = await productRepository.findLikedProductsByUserId(userId);
  return likedProducts.map(item => item.product);
};

export const createProduct = async (data: CreateProduct, userId: number) => {
  if (!data.title || data.price === undefined) {
    throw new Error('제목과 가격은 필수 입력사항입니다.');
  }

  if (isNaN(data.price) || data.price < 0) {
    throw new Error('가격은 0 이상의 숫자여야 합니다.');
  }

  return productRepository.createProduct({
    title: data.title,
    description: data.description,
    price: parseFloat(data.price.toString()),
    imageUrl: data.imageUrl,
    userId
  });
};

export const updateProduct = async (
  id: number,
  userId: number,
  data: { title?: string; description?: string; price?: number; imageUrl?: string }
) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  if (product.userId !== userId) {
    throw new Error('상품을 수정할 권한이 없습니다.');
  }

  let parsedPrice = undefined;
  if (data.price !== undefined) {
    if (isNaN(data.price) || data.price < 0) {
      throw new Error('가격은 0 이상의 숫자여야 합니다.');
    }
    parsedPrice = parseFloat(data.price.toString());
  }

  return productRepository.updateProduct(id, {
    ...(data.title && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(parsedPrice !== undefined && { price: parsedPrice }),
    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
  });
};

export const deleteProduct = async (id: number, userId: number) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  if (product.userId !== userId) {
    throw new Error('상품을 삭제할 권한이 없습니다.');
  }

  return productRepository.deleteProduct(id);
};

export const likeProduct = async (id: number, userId: number) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  const existingLike = await productRepository.findProductLike(userId, id);
  if (existingLike) {
    throw new Error('이미 좋아요를 누른 상품입니다.');
  }

  return productRepository.createProductLike(userId, id);
};

export const unlikeProduct = async (id: number, userId: number) => {
  const like = await productRepository.findProductLike(userId, id);
  if (!like) {
    throw new Error('좋아요를 누르지 않은 상품입니다.');
  }

  return productRepository.deleteProductLike(userId, id);
};

/**
 * 모든 상품 목록을 조회하되, 로그인한 사용자의 경우 '좋아요' 여부를 포함합니다.
 * @param userId - (선택 사항) 현재 로그인한 사용자의 ID
 * @returns 상품 목록과 각 상품의 좋아요 여부가 포함된 배열
 */
export const getAllProductsWithLikeStatus = async (userId?: number) => {
    // 1. Repository를 통해 모든 상품 정보를 가져옵니다.
    const allProducts = await productRepository.findAllProducts();

    // 2. 로그인한 사용자가 없다면, isLiked를 모두 false로 설정하여 반환합니다.
    if (!userId) {
        return allProducts.map(product => ({ ...product, isLiked: false }));
    }

    // 3. 로그인한 사용자가 있다면, 해당 사용자가 '좋아요'한 상품 목록을 가져옵니다.
    //    (결과를 Set으로 만들면 이후에 더 빠르게 확인할 수 있습니다.)
    const likedProducts = await productRepository.findLikedProductsByUserId(userId);
    const likedProductIds = new Set(likedProducts.map(like => like.productId));

    // 4. 전체 상품 목록을 순회하면서, '좋아요' 목록에 포함되어 있는지 여부에 따라 isLiked 값을 추가합니다.
    return allProducts.map(product => ({
        ...product,
        isLiked: likedProductIds.has(product.id),
    }));
};