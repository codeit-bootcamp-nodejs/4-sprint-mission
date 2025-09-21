import { productRepository } from "../repositories/productRepository.js";
import { productCommentsRepository } from "../repositories/productCommentsRepository.js";
import type { ProductComment } from "../repositories/productCommentsRepository.js";

export const productCommentsService = {
  getProductsComments: async (
    productId: number,
    cursor: number | undefined,
    limit: number
  ): Promise<ProductComment[]> => {
    try {
      let skip = 0;
      if (cursor) {
        skip = 1;
      }

      const productComments =
        await productCommentsRepository.getProductsComments(
          productId,
          limit,
          skip,
          cursor
        );

      if (productComments.length === 0) {
        const error: HttpError = new Error(
          "선택한 범위 내 댓글을 찾을 수 없습니다."
        );
        error.status = 404;
        throw error;
      }
      return productComments;
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
      const product = await productRepository.getProductById(productId);

      if (!product) {
        const error: HttpError = new Error("상품을 찾을 수 없습니다.");
        error.status = 404;
        throw error;
      }

      return await productCommentsRepository.createProductComment(
        productId,
        content,
        userId
      );
    } catch (err) {
      throw err;
    }
  },

  updateProductComment: async (
    productId: number,
    commentId: number,
    content: string,
    userId: number
  ): Promise<ProductComment> => {
    try {
      const comment =
        await productCommentsRepository.getCommentByIdAndProductId(
          commentId,
          productId
        );

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

      return await productCommentsRepository.updateProductComment(
        commentId,
        content
      );
    } catch (err) {
      throw err;
    }
  },

  deleteProductComment: async (
    commentId: number,
    productId: number,
    userId: number
  ): Promise<void> => {
    try {
      const comment =
        await productCommentsRepository.getCommentByIdAndProductId(
          commentId,
          productId
        );

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

      await productCommentsRepository.deleteProductComment(commentId);
    } catch (err) {
      throw err;
    }
  },
};
