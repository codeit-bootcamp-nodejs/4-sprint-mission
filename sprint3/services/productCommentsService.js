import prisma from "../lib/prisma.js";

export const findProductsComments = async (productId, cursor, limit) => {
  try {
    const productComments = await prisma.comment.findMany({
      where: { productId },
      take: parseInt(limit, 10),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    return productComments;
  } catch (err) {
    throw err;
  }
};

export const createProductComment = async (productId, content) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } },
      },
    });

    return comment;
  } catch (err) {
    throw err;
  }
};

export const updateProductComment = async (productId, commentId, content) => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        productId: productId,
      },
    });

    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }

    const updatedProductComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return updatedProductComment;
  } catch (err) {
    throw err;
  }
};

export const removeProductComment = async (commentId, productId) => {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        productId: productId,
      },
    });
  } catch (err) {
    throw err;
  }
};
