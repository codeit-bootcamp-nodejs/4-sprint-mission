import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { articleCommentRepository } from '../../repositories/article-cmt-repository.js';

class ArticleCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByArticleId(articleId: number, userId?: number) {
    const comments = await articleCommentRepository.findByArticleId(
      articleId,
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

  async createArticleComment(
    articleId: number,
    content: string,
    userId: number
  ) {
    return articleCommentRepository.create(articleId, content, userId);
  }
}

export const articleCommentService = new ArticleCommentService();
