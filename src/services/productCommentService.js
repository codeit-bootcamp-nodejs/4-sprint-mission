import prisma from "../lib/prisma.js";

export async function createProductComment(data) {
  const productComments = await prisma.productcomment.create({
    data,
  });
  return productComments;
}

export async function updateProductComment(id, data) {
  const pdCommentPatched = await prisma.productcomment.update({
    where: { id },
    data: {
      content: data.content,
    },
  });
  return pdCommentPatched;
}

export async function deleteProductComment(id) {
  const productComments = await prisma.productcomment.delete({
    where: { id },
  });
  return productComments;
}

export async function listProductComment(id, { cursor, limit }) {
  const productComments = await prisma.productcomment.findMany({
    where: {
      productId: id,
      ...(cursor && {
        createdAt: {
          lt: new Date(cursor),
        },
      }),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return productComments;
}

export async function getProductCommentById(id) {
  const productComment = await prisma.productcomment.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
  return productComment;
}
