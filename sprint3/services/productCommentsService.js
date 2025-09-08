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

export const createProductComment = async (productId, content, userId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        productId: productId,
        userId,
      },
    });

    return comment;
  } catch (err) {
    throw err;
  }
};

export const updateProductComment = async (
  productId,
  commentId,
  content,
  userId
) => {
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

    if (comment.userId !== userId) {
      throw new Error("댓글을 수정할 권한이 없습니다.");
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

export const removeProductComment = async (commentId, productId, userId) => {
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

    if (comment.userId !== userId) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }

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
