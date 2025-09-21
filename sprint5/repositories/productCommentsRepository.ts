import prisma from "../lib/prisma.js";
import type { ProductComment } from "../types/dto.js";

export const productCommentsRepository = {
  getProductsComments: async (
    productId: number,
    limit: number,
    skip: number,
    cursor: number | undefined
  ): Promise<ProductComment[]> => {
    try {
      return await prisma.comment.findMany({
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
    } catch (err) {
      throw err;
    }
  },

  createProductComment: async (
    productId: number,
    content: string,
    userId: number
  ): Promise<ProductComment> => {
    try {
      return await prisma.comment.create({
        data: {
          content,
          productId,
          userId,
        },
      });
    } catch (err) {
      throw err;
    }
  },

  getCommentByIdAndProductId: async (commentId: number, productId: number) => {
    try {
      const comment = await prisma.comment.findFirst({
        where: {
          id: commentId,
          productId,
        },
      });

      return comment;
    } catch (err) {
      throw err;
    }
  },

  updateProductComment: async (
    commentId: number,
    content: string
  ): Promise<ProductComment> => {
    try {
      return await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });
    } catch (err) {
      throw err;
    }
  },

  deleteProductComment: async (commentId: number): Promise<void> => {
    try {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (err) {
      throw err;
    }
    0;
  },
};
