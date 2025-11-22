import { CommentsRepository } from '../repositories/comments.repository.js';
import { NotificationType } from '@prisma/client'; // Import NotificationType
import { NotificationsService } from './notifications.service.js'; // Import NotificationsService
export class CommentsService {
    constructor() {
        this.commentsRepository = new CommentsRepository();
        this.notificationsService = NotificationsService.getInstance(); // Get singleton instance
        this.createArticleComment = async (articleId, createCommentDto, userId) => {
            const { content } = createCommentDto; // Destructure DTO
            if (!content) {
                const err = new Error("댓글 내용을 입력해주세요.");
                err.name = "BadRequestError";
                throw err;
            }
            const article = await this.commentsRepository.findArticleById(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            const newComment = await this.commentsRepository.createArticleComment(userId, articleId, content);
            // Notification for new comment on article
            if (article.authorId !== userId) { // If comment author is not article author
                await this.notificationsService.createNotification(article.authorId, NotificationType.NEW_COMMENT, `작성하신 게시글 '${article.title}'에 새로운 댓글이 달렸습니다.`, undefined, // No related product
                articleId);
            }
            return newComment;
        };
        this.createProductComment = async (productId, createCommentDto, userId) => {
            const { content } = createCommentDto; // Destructure DTO
            if (!content) {
                const err = new Error("댓글 내용을 입력해주세요.");
                err.name = "BadRequestError";
                throw err;
            }
            const product = await this.commentsRepository.findProductById(productId);
            if (!product) {
                const err = new Error("상품을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            const newComment = await this.commentsRepository.createProductComment(userId, productId, content);
            return newComment;
        };
        this.getArticleComments = async (articleId) => {
            const article = await this.commentsRepository.findArticleById(articleId);
            if (!article) {
                const err = new Error("게시글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            const comments = await this.commentsRepository.findCommentsByArticleId(articleId);
            return comments;
        };
        this.getProductComments = async (productId) => {
            const product = await this.commentsRepository.findProductById(productId);
            if (!product) {
                const err = new Error("상품을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            const comments = await this.commentsRepository.findCommentsByProductId(productId);
            return comments;
        };
        this.updateComment = async (commentId, updateCommentDto, userId) => {
            const { content } = updateCommentDto; // Destructure DTO
            const comment = await this.commentsRepository.findCommentById(commentId);
            if (!comment) {
                const err = new Error("댓글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            if (comment.authorId !== userId) {
                const err = new Error("댓글을 수정할 권한이 없습니다.");
                err.name = "ForbiddenError";
                throw err;
            }
            if (!content) {
                const err = new Error("수정할 내용을 입력해주세요.");
                err.name = "BadRequestError";
                throw err;
            }
            const updatedComment = await this.commentsRepository.updateComment(commentId, content);
            return updatedComment;
        };
        this.deleteComment = async (commentId, userId) => {
            const comment = await this.commentsRepository.findCommentById(commentId);
            if (!comment) {
                const err = new Error("댓글을 찾을 수 없습니다.");
                err.name = "NotFoundError";
                throw err;
            }
            if (comment.authorId !== userId) {
                const err = new Error("댓글을 삭제할 권한이 없습니다.");
                err.name = "ForbiddenError";
                throw err;
            }
            await this.commentsRepository.deleteComment(commentId);
        };
    }
}
