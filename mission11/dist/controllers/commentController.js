"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const zod_1 = require("zod");
const http_status_1 = __importDefault(require("http-status"));
const commentService_1 = require("../services/commentService");
const commentService = new commentService_1.CommentService();
const commentSchema = zod_1.z.object({
    content: zod_1.z.string().min(5).max(100),
});
const commentListSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
    lastId: zod_1.z.coerce.number().int().positive().optional(),
});
class CommentController {
    async createProductComment(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const productId = Number(req.params.id);
            const parsed = commentSchema.parse(req.body);
            const comment = await commentService.createProductComment(req.user.id, productId, parsed.content);
            res.status(http_status_1.default.CREATED).json(comment);
        }
        catch (err) {
            next(err);
        }
    }
    async createArticleComment(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const articleId = Number(req.params.id);
            const parsed = commentSchema.parse(req.body);
            const comment = await commentService.createArticleComment(req.user.id, articleId, parsed.content);
            res.status(http_status_1.default.CREATED).json(comment);
        }
        catch (err) {
            next(err);
        }
    }
    async modifyComment(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const commentId = Number(req.params.id);
            const parsed = commentSchema.parse(req.body);
            const updated = await commentService.updateComment(req.user.id, commentId, parsed.content);
            res.status(http_status_1.default.OK).json(updated);
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Comment not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
    async deleteComment(req, res, next) {
        try {
            if (!req.user)
                return res.status(http_status_1.default.UNAUTHORIZED).json({ message: "Unauthorized" });
            const commentId = Number(req.params.id);
            await commentService.deleteComment(req.user.id, commentId);
            res.status(http_status_1.default.NO_CONTENT).end();
        }
        catch (err) {
            if (err.message === "NOT_FOUND")
                return res.status(http_status_1.default.NOT_FOUND).json({ message: "Comment not found" });
            if (err.message === "FORBIDDEN")
                return res.status(http_status_1.default.FORBIDDEN).json({ message: "User not matched" });
            next(err);
        }
    }
    async productCommentList(req, res, next) {
        try {
            const parsed = commentListSchema.parse({ id: req.params.id, lastId: req.query.lastId });
            const comments = await commentService.getProductComments(parsed.id, parsed.lastId);
            res.status(http_status_1.default.OK).json(comments);
        }
        catch (err) {
            next(err);
        }
    }
    async articleCommentList(req, res, next) {
        try {
            const parsed = commentListSchema.parse({ id: req.params.id, lastId: req.query.lastId });
            const comments = await commentService.getArticleComments(parsed.id, parsed.lastId);
            res.status(http_status_1.default.OK).json(comments);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=commentController.js.map