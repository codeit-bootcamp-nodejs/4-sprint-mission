import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { ArticleService } from "../services/articleService";
import { ArticleCreateSchema, ArticleUpdateSchema, ArticleQuerySchema } from "../dtos/article.dto";

const articleService = new ArticleService();

export class ArticleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });

      const parsed = ArticleCreateSchema.parse(req.body);
      const article = await articleService.create(req.user.id, parsed);
      res.status(status.CREATED).json(article);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ArticleQuerySchema.parse(req.query);
      const articles = await articleService.list(parsed);
      res.status(status.OK).json(articles);
    } catch (err) {
      next(err);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const articleId = Number(req.params.id);
      const article = await articleService.getDetail(articleId);
      if (!article) return res.status(status.NOT_FOUND).json({ message: "Article not found" });
      res.status(status.OK).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const parsed = ArticleUpdateSchema.parse(req.body) as { title?: string; content?: string; };
      const articleId = Number(req.params.id);
      const updated = await articleService.update(req.user.id, parsed, articleId);

      res.status(status.OK).json(updated);
    } catch (err: any) {
      if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Article not found" });
      if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });

      const articleId = Number(req.params.id);
      await articleService.delete(req.user.id, articleId);
      res.status(status.NO_CONTENT).end();
    } catch (err: any) {
      if (err.message === "NOT_FOUND") return res.status(status.NOT_FOUND).json({ message: "Article not found" });
      if (err.message === "FORBIDDEN") return res.status(status.FORBIDDEN).json({ message: "User not matched" });
      next(err);
    }
  }
}
