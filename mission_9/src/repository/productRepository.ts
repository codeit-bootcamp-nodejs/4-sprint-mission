import prisma from "../lib/prisma.js";
import type {
  CreateProductDTO,
  GetProductsDTO,
  GetProductDTO,
  PatchProductDTO,
  DeleteProductDTO,
  PostCommentDTO,
  GetCommentsDTO,
  GetCommentDTO,
  PatchCommentDTO,
  DeleteCommentDTO,
  GetProductsByUserDTO,
} from "../types/product.js";

export async function createProduct(data: CreateProductDTO) {
  const { userId, name, description, price, tags } = data;

  return await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      userId,
    },
  });
}

export async function getProducts(data: GetProductsDTO) {
  const { offset, limit, sort, search } = data;

  const result = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: sort,
    },
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    skip: offset * limit,
    take: limit,
  });

  return result;
}

export async function getProduct(data: GetProductDTO) {
  const { id } = data;
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return result;
}

export async function patchProduct(data: PatchProductDTO) {
  const { id, ...filteredBody } = data;

  const result = await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      ...filteredBody,
    },
  });

  return result;
}

export async function deleteProduct(data: DeleteProductDTO) {
  const { id } = data;

  const result = await prisma.product.delete({
    where: {
      id,
    },
  });

  return result;
}

export async function postComment(data: PostCommentDTO) {
  const { pid, userId, name, content } = data;

  const result = await prisma.comment.create({
    data: {
      userId,
      name,
      content,
      productId: pid,
    },
  });

  return result;
}

export async function getComments(data: GetCommentsDTO) {
  const { pid, cursor, limit } = data;

  const result = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    where: {
      productId: Number(pid),
    },
    orderBy: {
      id: "asc",
    },
    take: Number(limit),
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: Number(cursor) },
        }
      : {}),
  });

  return result;
}

export async function getComment(data: GetCommentDTO) {
  const { cid: id } = data;

  const result = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  return result;
}

export async function patchComment(data: PatchCommentDTO) {
  const { cid, name, content } = data;

  const result = await prisma.comment.update({
    where: {
      id: Number(cid),
    },
    data: {
      name,
      content,
    },
  });

  return result;
}

export async function deleteComment(data: DeleteCommentDTO) {
  const { cid } = data;

  const result = await prisma.comment.delete({
    where: {
      id: Number(cid),
    },
  });

  return result;
}

export async function getProductsByUser(data: GetProductsByUserDTO) {
  const { userId: id } = data;

  const products = await prisma.user.findUnique({
    where: { id },
    select: {
      Product: true,
    },
  });

  return products;
}

export async function findLike(userId: number, productId: number) {
  return prisma.likedProduct.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function likeProduct(userId: number, productId: number) {
  return prisma.likedProduct.create({
    data: {
      userId,
      productId,
    },
  });
}

export async function unlikeProduct(userId: number, productId: number) {
  return prisma.likedProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function getLikedUsersByProductId(productId: number) {
  return prisma.likedProduct.findMany({
    where: { productId },
    select: { userId: true },
  });
}
