import { CommentRepository } from "../repositories/commentRepository";

export class CommentService {
  private repo = new CommentRepository();

  async createProductComment(userId: number, productId: number, content: string) {
    return this.repo.createProductComment(userId, productId, content);
  }

  async createArticleComment(userId: number, articleId: number, content: string) {
    return this.repo.createArticleComment(userId, articleId, content);
  }

  async updateComment(userId: number, commentId: number, content: string) {
    const comment = await this.repo.findById(commentId);
    if (!comment) throw new Error("NOT_FOUND");
    if (comment.userId !== userId) throw new Error("FORBIDDEN");
    return this.repo.updateComment(commentId, content);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.repo.findById(commentId);
    if (!comment) throw new Error("NOT_FOUND");
    if (comment.userId !== userId) throw new Error("FORBIDDEN");
    await this.repo.deleteComment(commentId);
  }

  async getProductComments(productId: number, lastId?: number) {
    return this.repo.findProductComments(productId, lastId);
  }

  async getArticleComments(articleId: number, lastId?: number) {
    return this.repo.findArticleComments(articleId, lastId);
  }
}
