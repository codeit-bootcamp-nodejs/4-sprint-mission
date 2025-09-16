import { ForbiddenError } from '@/lib/errors.js';
import type { PatchProduct, PostProduct, ProductParams } from '@/types/product.types.js';
import type { GetListParams } from '@/types/shared.type.js';
import prisma from '@lib/prisma.js';

async function authorization({ userId, productId }: ProductParams): Promise<boolean> {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });
  return product.userId === userId;
}

// prettier-ignore
async function getProductListService({ keyword, page, pageSize, userId }: GetListParams) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
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
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      userId,
    },
  });
  return product;
}

async function getProductService({ productId, userId }: ProductParams) {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      likes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  });
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
    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });
    return product;
  } else {
    throw new ForbiddenError('수정 권한이 없습니다.');
  }
}

async function deleteProductService({ userId, productId }: ProductParams) {
  if (await authorization({ userId, productId })) {
    const product = await prisma.product.delete({
      where: { id: productId },
    });
    return product;
  } else {
    throw new ForbiddenError('삭제 권한이 없습니다.');
  }
}

async function postProductLikeService({ userId, productId }: ProductParams) {
  const product = await prisma.productLike.create({
    data: {
      userId,
      productId,
    },
    select: {
      product: true,
    },
  });
  return product;
}

async function deleteProductLikeService({ userId, productId }: ProductParams) {
  const product = await prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    select: {
      product: true,
    },
  });
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
