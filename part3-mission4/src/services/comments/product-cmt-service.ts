import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { productCommentRepository } from '../../repositories/product-cmt-repository.js';

class ProductCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByProductId(productId: number, userId?: number) {
    const comments = await productCommentRepository.findByProductId(
      productId,
      userId
    );

    if (!comments.length)
      throw new AppError('해당 상품의 댓글을 찾을 수 없습니다.', 404);

    return comments.map((c) => ({
      ...c,
      isLiked: c.likedBy?.length > 0 || false,
      likeCount: c.likeCount,
    }));
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
