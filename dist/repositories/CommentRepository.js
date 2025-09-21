"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class CommentRepository {
    async findCommentById(id) {
        return index_1.default.comment.findUnique({ where: { id } });
    }
    async findComments(options) {
        return index_1.default.comment.findMany(options);
    }
    async createComment(data) {
        return index_1.default.comment.create({ data });
    }
    async updateComment(id, data) {
        return index_1.default.comment.update({ where: { id }, data });
    }
    async deleteComment(id) {
        return index_1.default.comment.delete({ where: { id } });
    }
}
exports.default = CommentRepository;
