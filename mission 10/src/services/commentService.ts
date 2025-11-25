import { CommentRepository } from "../repositories/commentRepository";
import { ArticleRepository } from "../repositories/articleRepository";
import { ProductRepository } from "../repositories/productRepository";
import { AlertService } from "../services/alertService";

export class CommentService {
  private repo = new CommentRepository();
  private articleRepo = new ArticleRepository();
  private productRepo = new ProductRepository();
  private alertService = new AlertService();

  async createArticleComment(
    userId: number,
    articleId: number,
    content: string
  ) {
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    const comment = await this.repo.createArticleComment(
      userId,
      articleId,
      content
    );

    if (article && article.userId !== userId) {
      await this.alertService.create(
        article.userId,
        "내 게시글에 새로운 댓글이 달렸습니다.",
        `/articles/${articleId}`
      );
    }

    return comment;
  }

  async createProductComment(
    userId: number,
    productId: number,
    content: string
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const comment = await this.repo.createProductComment(
      userId,
      productId,
      content
    );

    if (product && product.userId !== userId) {
      await this.alertService.create(
        product.userId,
        "내 판매글에 새로운 댓글이 달렸습니다.",
        `/products/${productId}`
      );
    }

    return comment;
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
