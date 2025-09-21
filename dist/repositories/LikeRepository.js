"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
class LikeRepository {
    async findLikeById(id) {
        return index_1.default.like.findUnique({ where: { id } });
    }
    async findLikes(options) {
        return index_1.default.like.findMany(options);
    }
    async createLike(data) {
        return index_1.default.like.create({ data });
    }
    async deleteLike(id) {
        return index_1.default.like.delete({ where: { id } });
    }
    async findLikeByUserIdAndProductId(userId, productId) {
        return index_1.default.like.findFirst({
            where: { userId, productId },
        });
    }
    async findLikeByUserIdAndArticleId(userId, articleId) {
        return index_1.default.like.findFirst({
            where: { userId, articleId },
        });
    }
}
exports.default = LikeRepository;
