import { prisma } from '../../lib/prismaClient.js';
import AppError from '../../lib/appError.js';
import { commentRepository } from './comment-repo.js';

type Comment = Awaited<ReturnType<typeof prisma.comment.findMany>>[number];

class ProductCommentService {
  // 공통 로직 조합
  updateComment = commentRepository.updateComment;
  deleteComment = commentRepository.deleteComment;
  commentLike = commentRepository.like;
  commentUnlike = commentRepository.unlike;

  // 상품의 댓글 조회
  async getCommentsByProductId(productId: number, userId?: number) {
    const comments = await prisma.comment.findMany({
      where: { productId: productId, articleId: null },
      include: {
        user: { select: { username: true } },
        likedBy: {
          select: { id: true },
          ...(userId && { where: { id: userId } }),
        },
      },
    });
    if (!comments.length)
      throw new AppError('해당 상품의 댓글을 찾을 수 없습니다.', 404);

    return comments.map((c) => ({
      ...c,
      isLiked: c.likedBy?.length > 0 || false,
      likeCount: c.likeCount,
    }));
  }

  // 상품의 댓글 작성
  async createProductComment(
    productId: number,
    content: string,
    userId: number
  ) {
    return prisma.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });
  }
}

export const productCommentService = new ProductCommentService();
