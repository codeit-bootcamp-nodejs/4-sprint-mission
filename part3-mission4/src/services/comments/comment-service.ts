import { commentRepository } from '../../repositories/comment-reposipory.js';
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
    if (deleted.count === 0)
      throw new AppError('권한이 없거나 댓글이 존재하지 않습니다.', 403);

    return { message: '댓글이 삭제되었습니다.' };
  }

  async likeComment(userId: number, commentId: number) {
    return commentRepository.like(userId, commentId);
  }

  async unlikeComment(userId: number, commentId: number) {
    return commentRepository.unlike(userId, commentId);
  }
}

export const commentService = new CommentService();
