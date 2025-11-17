"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../lib/error"));
class CommentService {
    async getCommentList(input) {
        const { skip, take, type } = input;
        const commentId = Number(input.id);
        // 만약애 타입이 중고 시장 -> 중고시장 댓글들만 보이기
        const whereCondition = type === "MARKET" ? { productId: commentId } : { articleId: commentId };
        const includeField = type === "MARKET" ? { product: true } : { article: true };
        const commentList = await prisma_1.default.comment.findMany({
            where: whereCondition,
            include: includeField,
            take,
            skip,
        });
        return commentList;
    }
    async getComment(input) {
        const commentId = +input.id; //
        const comment = await prisma_1.default.comment.findUnique({
            where: {
                id: commentId,
            },
        });
        if (!comment)
            throw new error_1.default(404, "댓글이 존재 하지 않습니다");
        return comment;
    }
    async createComment(input) {
        const { title, content, type, productId, articleId } = input;
        const connectedData = type === "Market"
            ? { connect: { id: productId } }
            : type === "ARTICLE"
                ? { connect: { id: articleId } }
                : {};
        const newComment = await prisma_1.default.comment.create({
            data: {
                title,
                ...connectedData,
                content,
            },
        });
        return newComment;
    }
    async modifyComment(input) {
        const { title, content, commentId } = input;
        return await prisma_1.default.comment.update({
            where: {
                id: commentId,
            },
            data: {
                title,
                content,
            },
        });
    }
    async deleteComment(input) {
        const commentId = input.commentId;
        const isValid = await this.getComment({ id: commentId });
        if (!isValid)
            throw new error_1.default(404, "삭제하려는 댓글이 존재하지 않습니다.");
        await prisma_1.default.comment.delete({
            where: {
                id: commentId
            },
        });
    }
}
exports.CommentService = CommentService;
