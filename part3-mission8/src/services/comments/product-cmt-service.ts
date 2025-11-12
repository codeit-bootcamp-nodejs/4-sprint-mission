import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { productCommentRepository } from '../../repositories/comments/product-cmt-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import { notificationService } from '../notification-service.js';
import { userRepository } from '../../repositories/user-repository.js';
import { productRepository } from '../../repositories/product-repository.js';

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
    // 1) 상품 정보(소유자, 이름)
    const product = await productRepository.findLiteById(productId);
    if (!product) throw new AppError('상품을 찾을 수 없습니다.', 404);

    // 2) 댓글 생성
    const comment = await productCommentRepository.create(
      productId,
      content,
      userId
    );

    // 3) 자기 상품에 본인이 단 댓글은 알림 스킵
    if (product.userId !== userId) {
      const commenter = await userRepository.findUsernameById(userId);

      await notificationService.pushProductComment({
        receiverUserId: product.userId,
        productId: product.id,
        commentId: comment.id,
        productName: product.name,
        commenterName: commenter?.username ?? '익명',
      });
    }

    return comment;
  }
}

export const productCommentService = new ProductCommentService();
