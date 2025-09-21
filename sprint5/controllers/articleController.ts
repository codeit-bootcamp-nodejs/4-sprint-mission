import type { Request, Response, NextFunction } from "express";
import { articleService } from "../services/articleService.js";

interface GetArticleListQuery {
  offset?: string;
  limit?: string;
  title?: string;
  content?: string;
}

interface ArticleId {
  id: string;
}

interface ArticleBody {
  title?: string;
  content?: string;
}

export const articleController = {
  getArticleList: async (
    req: Request<{}, {}, {}, GetArticleListQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const title = req.query.title;
      const content = req.query.content;

      const userId = req.user?.id || null;

      const articles = await articleService.getArticles(
        offset,
        limit,
        title,
        content,
        userId
      );

      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  },

  postArticle: async (
    req: Request<{}, {}, ArticleBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, content } = req.body;
      const userId = Number(req.user!.id);

      const article = await articleService.createArticle(
        title!,
        content!,
        userId
      );

      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  },

  getArticleById: async (
    req: Request<ArticleId>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id || null;

      const article = await articleService.getArticleById(id, userId);

      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  },

  patchArticle: async (
    req: Request<ArticleId, {}, ArticleBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user!.id);

      const { title, content } = req.body;

      const article = await articleService.updateArticle(
        id,
        title,
        content,
        userId
      );

      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  },

  deleteArticle: async (
    req: Request<ArticleId>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user!.id);

      await articleService.deleteArticle(id, userId);

      res.status(200).json({ message: `${id} 삭제 완료` });
    } catch (err) {
      next(err);
    }
  },
};

export default articleController; // 기본 내보내기
