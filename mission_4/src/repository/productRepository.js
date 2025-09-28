import prisma from "../../lib/prisma.js";

export async function createProduct({
  userId,
  name,
  description,
  price,
  tags,
}) {
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

export async function getProducts({ offset, limit, sort, search }) {
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

export async function getProduct(id) {
  const result = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return result;
}

export async function patchProduct({ id, ...filteredBody }) {
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

export async function deleteProduct(id) {
  const result = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });

  return result;
}

export async function postComment({ userId, pid, name, content }) {
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

export async function getComments({ pid, cursor, limit }) {
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

export async function getComment(cid) {
  const result = await prisma.comment.findUnique({
    where: {
      id: cid,
    },
  });

  return result;
}

export async function patchComment({ cid, name, content }) {
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

export async function deleteComment(cid) {
  const result = await prisma.comment.delete({
    where: {
      id: Number(cid),
    },
  });

  return result;
}

export async function getProductsByUser(userId) {
  const products = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      Product: true,
    },
  });

  return products;
}