import prisma from "../lib/prisma.js";

// prettier-ignore
async function getProductListService({ keyword, page, pageSize, userId }) {
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
      User: {
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
    const { likes, _count, ...filteredProduct } = product;
    return {
      likeCount: product._count.likes,
      isLike: userId ? product.likes.length === 1 : false,
      ...filteredProduct,
    };
  });
  return results;
}

async function postProductService({ userId, name, description, price, tags }) {
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

async function getProductService({ productId, userId }) {
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
      User: {
        select: {
          id: true,
          email: true,
          nickname: true,
        },
      },
    },
  });
  const { likes, _count, ...filteredProduct } = product;
  const result = {
    likeCount: product._count.likes,
    isLike: userId ? product.likes.length === 1 : false,
    ...filteredProduct,
  };
  return result;
}

async function patchProductService({ id, data }) {
  const product = await prisma.product.update({
    where: id,
    data,
  });
  return product;
}

async function deleteProductService({ id }) {
  const product = await prisma.product.delete({
    where: id,
  });
  return product;
}

async function postProductLikeService({ userId, productId }) {
  const product = await prisma.productLike.create({
    data: {
      userId,
      productId,
    },
  });
  return product;
}

async function deleteProductLikeService({ userId, productId }) {
  const product = await prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
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
