import { LikeRepository } from "../repositories/likeRepository";

export class LikeService {
  private repo = new LikeRepository();

  async likeArticle(userId: number, articleId: number) {
    const article = await this.repo.findArticle(articleId);
    if (!article) throw new Error("ARTICLE_NOT_FOUND");

    const existing = await this.repo.findArticleLike(userId, articleId);
    if (existing) {
      return this.repo.toggleArticleLike(userId, articleId, existing.like);
    }
    return this.repo.createArticleLike(userId, articleId);
  }

  async likeProduct(userId: number, productId: number) {
    const product = await this.repo.findProduct(productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const existing = await this.repo.findProductLike(userId, productId);
    if (existing) {
      return this.repo.toggleProductLike(userId, productId, existing.like);
    }
    return this.repo.createProductLike(userId, productId);
  }

  async getLikedArticles(userId: number) {
    return this.repo.findLikedArticles(userId);
  }

  async getLikedProducts(userId: number) {
    return this.repo.findLikedProducts(userId);
  }
}