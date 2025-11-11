import { productCommentService } from '../services/comments/product-cmt-service.js';

class ProductCommentController {
  async getComments(req, res) {
    const { productId } = req.params;
    const userId = req.user?.id ?? null;
    const comments = await productCommentService.getCommentsByProductId(
      productId,
      userId
    );
    res.json(comments);
  }

  async createComment(req, res) {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const newComment = await productCommentService.createProductComment(
      productId,
      content,
      userId
    );
    res.status(201).json(newComment);
  }

  async updateComment(req, res) {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const updated = await productCommentService.updateComment(
      commentId,
      userId,
      content
    );
    res.json(updated);
  }

  async deleteComment(req, res) {
    const { commentId } = req.params;
    const userId = req.user.id;
    const result = await productCommentService.deleteComment(commentId, userId);
    res.json(result);
  }

  async likeComment(req, res) {
    const { commentId } = req.params;
    const userId = req.user.id;
    const result = await productCommentService.commentLike(userId, commentId);
    res.json(result);
  }

  async unlikeComment(req, res) {
    const { commentId } = req.params;
    const userId = req.user.id;
    const result = await productCommentService.commentUnlike(userId, commentId);
    res.json(result);
  }
}

export const productCommentController = new ProductCommentController();
