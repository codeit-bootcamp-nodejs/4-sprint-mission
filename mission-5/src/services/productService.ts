import { ForbiddenError } from '@/lib/errors.js';
import type { PatchProduct, PostProduct, ProductParams } from '@/types/product.types.js';
import type { GetListParams } from '@/types/shared.type.js';
import ProductRepository from '@/repositories/products.repository.js';

async function authorization({ userId, productId }: ProductParams): Promise<boolean> {
  const product = await ProductRepository.findOwnerById({ productId });
  return product.userId === userId;
}

// prettier-ignore
async function getProductListService({ keyword, page, pageSize, userId }: GetListParams) {
  const products = await ProductRepository.findMany({ keyword, page, pageSize, userId })
  const results = products.map((product) => {
    const { likes: _likes, _count, ...filteredProduct } = product;
    return {
      likeCount: product._count.likes,
      isLike: userId ? product.likes.length === 1 : false,
      ...filteredProduct,
    };
  });
  return results;
}

async function postProductService({ userId, name, description, price, tags }: PostProduct) {
  const product = await ProductRepository.create({ userId, name, description, price, tags });
  return product;
}

async function getProductService({ productId, userId }: ProductParams) {
  const product = await ProductRepository.findById({ productId, userId });
  const { likes: _likes, _count, ...filteredProduct } = product;
  const result = {
    likeCount: product._count.likes,
    isLike: userId ? product.likes.length === 1 : false,
    ...filteredProduct,
  };
  return result;
}

async function patchProductService({ userId, productId, data }: PatchProduct) {
  if (await authorization({ userId, productId })) {
    const product = await ProductRepository.update({ productId, data });
    return product;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteProductService({ userId, productId }: ProductParams) {
  if (await authorization({ userId, productId })) {
    const product = await ProductRepository.delete({ productId });
    return product;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}

async function postProductLikeService({ userId, productId }: ProductParams) {
  const product = await ProductRepository.like({ userId, productId });
  return product;
}

async function deleteProductLikeService({ userId, productId }: ProductParams) {
  const product = await ProductRepository.unlike({ userId, productId });
  return product;
}

export {
  getProductListService,
  postProductService,
  getProductService,
  patchProductService,
  deleteProductService,
  postProductLikeService,
  deleteProductLikeService,
};
