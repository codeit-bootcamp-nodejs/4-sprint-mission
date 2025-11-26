import { commentService } from './comment-service.js';
import AppError from '../../lib/appError.js';
import { productCommentRepository } from '../../repositories/comments/product-comment-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import { productRepository } from '../../repositories/product-repository.js';
import { userRepository } from '../../repositories/user-repository.js';
import { notificationService } from '../notification-service.js';

class ProductCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByProductId(productId: number, userId?: number) {
    const comments = await productCommentRepository.findByProductId(productId);
    if (comments.length === 0) return [];

    const commentIds = comments.map((c) => c.id);

    // 1) 댓글별 likeCount 한 번에 가져오기
    const grouped = await commentLikeRepository.countByTargetIds(commentIds);
    const likeCountMap = grouped.reduce<Record<number, number>>((acc, row) => {
      acc[row.commentId] = row._count.commentId;
      return acc;
    }, {});

    // 2) 유저가 좋아요 누른 댓글들 한 번에 가져오기
    let likedSet = new Set<number>();
    if (userId) {
      const likedRows = await commentLikeRepository.findByUserAndTargetIds(
        userId,
        commentIds
      );
      likedSet = new Set(likedRows.map((row) => row.commentId));
    }

    // 3) 메모리에서 합쳐서 반환
    return comments.map((c) => ({
      ...c,
      likeCount: likeCountMap[c.id] ?? 0,
      isLiked: userId ? likedSet.has(c.id) : false,
    }));
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
