import { CommentsService } from '../services/comments.service.js'; // Corrected import
export class CommentsController {
    constructor() {
        this.commentsService = new CommentsService(); // Corrected service instance
        // 게시글 댓글 생성
        this.createArticleComment = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const createCommentDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const newComment = await this.commentsService.createArticleComment(+articleId, createCommentDto, userId); // Pass DTO
                return res.status(201).json({ data: newComment });
            }
            catch (err) {
                next(err);
            }
        };
        // 상품 댓글 생성
        this.createProductComment = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const createCommentDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const newComment = await this.commentsService.createProductComment(+productId, createCommentDto, userId); // Pass DTO
                return res.status(201).json({ data: newComment });
            }
            catch (err) {
                next(err);
            }
        };
        // 게시글 댓글 목록 조회
        this.getArticleComments = async (req, res, next) => {
            try {
                const { articleId } = req.params;
                const articleComments = await this.commentsService.getArticleComments(+articleId);
                return res.status(200).json({ data: articleComments });
            }
            catch (err) {
                next(err);
            }
        };
        // 상품 댓글 목록 조회
        this.getProductComments = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const productComments = await this.commentsService.getProductComments(+productId);
                return res.status(200).json({ data: productComments });
            }
            catch (err) {
                next(err);
            }
        };
        // 댓글 수정
        this.updateComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const updateCommentDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const updatedComment = await this.commentsService.updateComment(+commentId, updateCommentDto, userId);
                return res.status(200).json({ data: updatedComment });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                if (err.name === "BadRequestError") {
                    return res.status(400).json({ message: err.message });
                }
                next(err);
            }
        };
        // 댓글 삭제
        this.deleteComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                await this.commentsService.deleteComment(+commentId, userId);
                return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                next(err);
            }
        };
    }
}
