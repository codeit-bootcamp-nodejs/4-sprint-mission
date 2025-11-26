import type { Request, Response } from 'express';

import { articleService } from '../services/article-service.js';

class ArticleController {
  // 게시글
  async getAllArticles(req: Request, res: Response) {
    const userId = req.user?.id;
    const { data, pagination } = await articleService.getAllArticles(
      req.query,
      userId
    );
    res.json({ data, pagination });
  }
  async getArticleById(req: Request, res: Response) {
    const userId = req.user?.id;
    const idParam = req.params.id;
    const articleId = parseInt(idParam!, 10);
    const article = await articleService.getArticleById(articleId, userId);
    res.status(200).json({ data: article });
  }

  async createArticle(req: Request, res: Response) {
    const { title, content } = req.body;
    const userId = req.user!.id;
    const newArticle = await articleService.createArticle(
      title,
      content,
      userId
    );
    res.status(201).json({ data: newArticle });
  }

  async updateArticle(req: Request, res: Response) {
    const idParam = req.params.id;
    const id = parseInt(idParam!, 10);
    const { title, content, tags, images } = req.body;
    const updateData = { title, content, tags, images };
    const userId = req.user!.id;
    const updated = await articleService.updateArticle(id, userId, updateData);
    res.json({ data: updated });
  }

  async deleteArticle(req: Request, res: Response) {
    const idParam = req.params.id;
    const id = parseInt(idParam!, 10);
    const userId = req.user!.id;
    await articleService.deleteArticle(id, userId);
    res.status(204).send();
  }

  async likeArticle(req: Request, res: Response) {
    const userId = req.user!.id;
    const idParam = req.params.id;
    const articleId = parseInt(idParam!, 10);
    const article = await articleService.articleLike(userId, articleId);
    res.json({ data: article });
  }

  async unlikeArticle(req: Request, res: Response) {
    const userId = req.user!.id;
    const idParam = req.params.id;
    const articleId = parseInt(idParam!, 10);
    const result = await articleService.articleUnlike(userId, articleId);
    res.status(200).json({ data: result });
  }

  // 본인이 작성한 게시글 조회
  async getUserArticles(req: Request, res: Response) {
    const userId = req.user!.id;
    const articles = await articleService.getUserArticles(userId);
    res.status(200).json({ data: articles });
  }
}

export const articleController = new ArticleController();
