"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LikeService {
    constructor(likeRepository) {
        this.likeRepository = likeRepository;
    }
    async createLike(data) {
        const { userId, productId, articleId, ...rest } = data;
        return this.likeRepository.createLike({
            ...rest,
            user: { connect: { id: userId } },
            ...(productId && { product: { connect: { id: productId } } }),
            ...(articleId && { article: { connect: { id: articleId } } }),
        });
    }
    async deleteLike(id) {
        return this.likeRepository.deleteLike(id);
    }
    async findLikeByUserIdAndProductId(userId, productId) {
        return this.likeRepository.findLikeByUserIdAndProductId(userId, productId);
    }
    async findLikeByUserIdAndArticleId(userId, articleId) {
        return this.likeRepository.findLikeByUserIdAndArticleId(userId, articleId);
    }
    async findLikes(options) {
        return this.likeRepository.findLikes(options);
    }
}
exports.default = LikeService;
