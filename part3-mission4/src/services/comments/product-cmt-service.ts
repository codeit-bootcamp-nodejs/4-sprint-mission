import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { productCommentRepository } from '../../repositories/product-cmt-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';

class ProductCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByProductId(productId: number, userId?: number) {
    const comments = await productCommentRepository.findByProductId(productId);

    return Promise.all(
      comments.map(async (c) => {
        const likeCount = await commentLikeRepository.count(c.id);
        const isLiked = userId
          ? await commentLikeRepository.exists(userId, c.id)
          : false;

        return {
          ...c,
          likeCount,
          isLiked,
        };
      })
    );
  }

  async createProductComment(
    productId: number,
    content: string,
    userId: number
  ) {
    return productCommentRepository.create(productId, content, userId);
  }
}

export const productCommentService = new ProductCommentService();
