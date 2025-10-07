"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_service_1 = require("../comment/comment.service");
const error_1 = __importDefault(require("../lib/error"));
const commentService = new comment_service_1.CommentService();
class CommentController {
    // 전체 댓글 조회 api
    async getComments(params, query, res, next) {
        try {
            const { take, page, type } = query; // 이미 validate 하고 옴
            const skip = (page - 1) * take;
            const commentId = Number(params.id);
            if (skip > 0 || skip > 100)
                throw new error_1.default(400, "잘못된 스킵값");
            const result = await commentService.getCommentList({
                skip,
                take,
                type,
                id: commentId
            });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // 특정 댓글 조회 API
    async getCommentCont(params, res, next) {
        try {
            const commentId = params;
            const result = await commentService.getComment({ id: commentId });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    //댓글 생성API
    async createCommentCont(body, query, res, next) {
        try {
            const { title, content } = body;
            const { type } = query;
            const { productId, articleId } = query;
            const result = await commentService.createComment({
                title,
                content,
                type,
                productId: Number(productId),
                articleId: Number(articleId),
            });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    //특정 댓글 수정 API
    async modifyCommentCont(req, res, next) {
        try {
            const { title, content } = req.body;
            const commentId = req.params;
            const result = await commentService.modifyComment({
                title,
                content,
                commentId,
            });
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    //특정 댓글 삭제 API
    async deleteCommentCont(req, res, next) {
        try {
            const commentId = Number(req.params.id);
            await commentService.deleteComment({ commentId });
            return res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
