import { commentRepository } from '../../repositories/comments/comment-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import AppError from '../../lib/appError.js';

class CommentService {
  async updateComment(commentId: number, userId: number, content: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new AppError('댓글을 찾을 수 없습니다.', 404);
    if (comment.userId !== userId) throw new AppError('권한이 없습니다.', 403);

    return commentRepository.update(commentId, content);
  }

  async deleteComment(commentId: number, userId: number) {
    const deleted = await commentRepository.delete(commentId, userId);
    if (deleted.count === 0) {
      throw new AppError('권한이 없거나 댓글이 존재하지 않습니다.', 403);
    }
    return { message: '댓글이 삭제되었습니다.' };
  }

  async likeComment(userId: number, commentId: number) {
    const exists = await commentLikeRepository.exists(userId, commentId);
    if (exists) {
      throw new AppError('이미 좋아요를 눌렀습니다.', 400);
    }

    await commentLikeRepository.create(userId, commentId);
    const count = await commentLikeRepository.count(commentId);
    return { message: '좋아요 완료', likeCount: count };
  }

  async unlikeComment(userId: number, commentId: number) {
    const exists = await commentLikeRepository.exists(userId, commentId);
    if (!exists) {
      throw new AppError('좋아요를 누른 기록이 없습니다.', 400);
    }

    await commentLikeRepository.delete(userId, commentId);
    const count = await commentLikeRepository.count(commentId);
    return { message: '좋아요 취소', likeCount: count };
  }
}

export const commentService = new CommentService();
