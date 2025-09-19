import prisma from "../lib/prisma.js";

interface ProductComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const findProductsComments = async (
  productId: number,
  cursor: number | undefined,
  limit: number
): Promise<ProductComment[]> => {
  try {
    let skip = 0;
    if (cursor) {
      skip = 1;
    }

    const productComments = await prisma.comment.findMany({
      where: { productId },
      take: limit,
      skip,
      ...(cursor ? { cursor: { id: cursor } } : {}),
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

export const createProductComment = async (
  productId: number,
  content: string,
  userId: number
): Promise<ProductComment> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error: HttpError = new Error("상품을 찾을 수 없습니다.");
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
  productId: number,
  commentId: number,
  content: string,
  userId: number
): Promise<ProductComment> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        productId: productId,
      },
    });

    if (!comment) {
      const error: HttpError = new Error("댓글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error: HttpError = new Error("댓글을 수정할 권한이 없습니다.");
      error.status = 403;
      throw error;
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

export const removeProductComment = async (
  commentId: number,
  productId: number,
  userId: number
): Promise<void> => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        productId: productId,
      },
    });

    if (!comment) {
      const error: HttpError = new Error("댓글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error: HttpError = new Error("댓글을 삭제할 권한이 없습니다.");
      error.status = 403;
      throw error;
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
