import { articleCommentService } from '../services/comments/article-cmt-service.js';
class ArticleCommentController {
    async getComments(req, res) {
        const idParam = req.params.articleId;
        const articleId = parseInt(idParam, 10);
        const userId = req.user?.id;
        const comments = await articleCommentService.getCommentsByArticleId(articleId, userId);
        res.json(comments);
    }
    async createComment(req, res) {
        const idParam = req.params.articleId;
        const articleId = parseInt(idParam, 10);
        const { content } = req.body;
        const userId = req.user.id;
        const newComment = await articleCommentService.createArticleComment(articleId, content, userId);
        res.status(201).json(newComment);
    }
    async updateComment(req, res) {
        const idParam = req.params.commentId;
        const commentId = parseInt(idParam, 10);
        const { content } = req.body;
        const userId = req.user.id;
        const updated = await articleCommentService.updateComment(commentId, userId, content);
        res.json(updated);
    }
    async deleteComment(req, res) {
        const idParam = req.params.commentId;
        const commentId = parseInt(idParam, 10);
        const userId = req.user.id;
        const result = await articleCommentService.deleteComment(commentId, userId);
        res.json(result);
    }
    async likeComment(req, res) {
        const idParam = req.params.commentId;
        const commentId = parseInt(idParam, 10);
        const userId = req.user.id;
        const result = await articleCommentService.commentLike(userId, commentId);
        res.json(result);
    }
    async unlikeComment(req, res) {
        const idParam = req.params.commentId;
        const commentId = parseInt(idParam, 10);
        const userId = req.user.id;
        const result = await articleCommentService.commentUnlike(userId, commentId);
        res.json(result);
    }
}
export const articleCommentController = new ArticleCommentController();
//# sourceMappingURL=article-cmt-controller.js.map