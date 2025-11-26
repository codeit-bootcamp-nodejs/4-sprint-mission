import { commentService } from './comment-service.js';
import AppError from '../../lib/appError.js';
import { articleRepository } from '../../repositories/article-repository.js';
import { articleCommentRepository } from '../../repositories/comments/article-comment-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
import { userRepository } from '../../repositories/user-repository.js';
import { notificationService } from '../notification-service.js';

class ArticleCommentService {
  updateComment = commentService.updateComment;
  deleteComment = commentService.deleteComment;
  commentLike = commentService.likeComment;
  commentUnlike = commentService.unlikeComment;

  async getCommentsByArticleId(articleId: number, userId?: number) {
    const comments = await articleCommentRepository.findByArticleId(articleId);
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

      await notificationService.pushArticleComment({
        receiverUserId: article.userId,
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
