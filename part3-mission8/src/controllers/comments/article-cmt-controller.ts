import type { Request, Response } from 'express';
import { articleCommentService } from '../../services/comments/article-cmt-service.js';

class ArticleCommentController {
  async getComments(req: Request, res: Response) {
    const idParam = req.params.articleId;
    const articleId = parseInt(idParam!, 10);
    const userId = req.user?.id;
    const comments = await articleCommentService.getCommentsByArticleId(
      articleId,
      userId
    );
    res.json(comments);
  }

  async createComment(req: Request, res: Response) {
    const idParam = req.params.articleId;
    const articleId = parseInt(idParam!, 10);
    const { content } = req.body;
    const userId = req.user!.id;
    const newComment = await articleCommentService.createArticleComment(
      articleId,
      content,
      userId
    );
    res.status(201).json(newComment);
  }

  async updateComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const { content } = req.body;
    const userId = req.user!.id;
    const updated = await articleCommentService.updateComment(
      commentId,
      userId,
      content
    );
    res.json(updated);
  }

  async deleteComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    const result = await articleCommentService.deleteComment(commentId, userId);
    res.json(result);
  }

  async likeComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    const result = await articleCommentService.commentLike(userId, commentId);
    res.json(result);
  }

  async unlikeComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    const result = await articleCommentService.commentUnlike(userId, commentId);
    res.json(result);
  }
}

export const articleCommentController = new ArticleCommentController();
