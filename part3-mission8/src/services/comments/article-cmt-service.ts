import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { articleCommentRepository } from '../../repositories/comments/article-cmt-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import { notificationService } from '../notification-service.js';
import { userRepository } from '../../repositories/user-repository.js';
import { articleRepository } from '../../repositories/article-repository.js';

class ArticleCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByArticleId(articleId: number, userId?: number) {
    const comments = await articleCommentRepository.findByArticleId(articleId);

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

  async createArticleComment(
    articleId: number,
    content: string,
    userId: number
  ) {
    // 1) 글 정보(작성자, 제목) → 레포
    const article = await articleRepository.findLiteById(articleId);
    if (!article) throw new AppError('게시글을 찾을 수 없습니다.', 404);

    // 2) 댓글 생성 → 레포
    const comment = await articleCommentRepository.create(
      articleId,
      content,
      userId
    );

    // 3) 자기 글에 본인이 단 댓글은 알림 스킵
    if (article.userId !== userId) {
      // 4) 작성자명 → 레포
      const commenter = await userRepository.findUsernameById(userId);

      await notificationService.pushNewComment({
        receiverUserId: article.userId, // 글 작성자
        articleId: article.id,
        commentId: comment.id,
        articleTitle: article.title,
        commenterName: commenter?.username ?? '익명',
      });
    }

    return comment;
  }
}

export const articleCommentService = new ArticleCommentService();
