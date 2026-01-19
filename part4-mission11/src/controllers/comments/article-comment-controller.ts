import type { Request, Response } from 'express';

import { articleCommentService } from '../../services/comments/article-comment-service.js';

class ArticleCommentController {
  async getComments(req: Request, res: Response) {
    const idParam = req.params.articleId;
    const articleId = parseInt(idParam!, 10);
    const userId = req.user?.id;
    const comments = await articleCommentService.getCommentsByArticleId(
      articleId,
      userId
    );
    res.json({ data: comments });
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
    return res.status(201).json({ data: newComment });
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
    res.json({ data: updated });
  }

  async deleteComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    await articleCommentService.deleteComment(commentId, userId);
    return res.status(204).send();
  }

  async likeComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    const result = await articleCommentService.commentLike(userId, commentId);
    res.status(200).json({ data: result });
  }

  async unlikeComment(req: Request, res: Response) {
    const idParam = req.params.commentId;
    const commentId = parseInt(idParam!, 10);
    const userId = req.user!.id;
    const result = await articleCommentService.commentUnlike(userId, commentId);
    res.status(200).json({ data: result });
  }
}

export const articleCommentController = new ArticleCommentController();
