import prisma from '../../lib/prismaClient.js';
import AppError from '../../lib/appError.js';
import { commentRepository } from './comment-repo.js';

class ProductCommentService {
  // 공통 로직 조합
  updateComment = commentRepository.updateComment;
  deleteComment = commentRepository.deleteComment;
  commentLike = commentRepository.like;
  commentUnlike = commentRepository.unlike;

  async getCommentsByProductId(productId, userId) {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId), articleId: null },
      include: {
        user: { select: { username: true } },
        likedBy: userId
          ? { where: { id: userId }, select: { id: true } }
          : false,
      },
    });
    if (!comments.length)
      throw new AppError('해당 상품의 댓글을 찾을 수 없습니다.', 404);

    return comments.map((c) => ({
      ...c,
      isLiked: userId ? c.likedBy.length > 0 : false,
      likeCount: c.likeCount,
    }));
  }

  async createProductComment(productId, content, userId) {
    return prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: parseInt(productId) } },
      },
    });
  }
}

export const productCommentService = new ProductCommentService();
