import AppError from '../../lib/appError.js';
import { commentService } from './comment-service.js';
import { articleCommentRepository } from '../../repositories/article-cmt-repository.js';
import { commentLikeRepository } from '../../repositories/like-repository.js';
class ArticleCommentService {
    updateComment = commentService.updateComment;
    deleteComment = commentService.deleteComment;
    commentLike = commentService.likeComment;
    commentUnlike = commentService.unlikeComment;
    async getCommentsByArticleId(articleId, userId) {
        const comments = await articleCommentRepository.findByArticleId(articleId);
        return Promise.all(comments.map(async (c) => {
            const likeCount = await commentLikeRepository.count(c.id);
            const isLiked = userId
                ? await commentLikeRepository.exists(userId, c.id)
                : false;
            return {
                ...c,
                likeCount,
                isLiked,
            };
        }));
    }
    async createArticleComment(articleId, content, userId) {
        return articleCommentRepository.create(articleId, content, userId);
    }
}
export const articleCommentService = new ArticleCommentService();
//# sourceMappingURL=article-cmt-service.js.map