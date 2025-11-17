import type { Request, Response, NextFunction } from "express";
import { ArticleService } from "../service/article.service.js";
import type {
  ArticleDTO,
  ArticleQueryDTO,
  PatchArticleDTO,
} from "../dto/article.dto.js";
import type { PrismaClient } from "@prisma/client/extension";

export class ArticleController {
  private articleService: ArticleService;
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.articleService = new ArticleService(this.prisma);
  }

  async accessArticleList(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, take, title, content, keyword } = req.query;

      
      const query: ArticleQueryDTO = {
        // <- 타입 지정
        page: Number(page ?? 1),
        take: Number(take ?? 10),
        title: String(title ?? ""),
        content: String(content ?? ""),
        keyword: String(keyword ?? ""),
      };

      const result = await this.articleService.accessArticleList(query);

      res.status(200).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async accessArticle(req: Request, res: Response, next: NextFunction) {
    console.log("accessArticle 호출됨");
    try {
      const articleId = Number(req.params.id);
      const result = await this.articleService.accessArticle(articleId);
      res.status(200).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, title, content, createdAt, ownerId, comments } = req.body;

      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unauthorized"); // 401 error
      const elements: ArticleDTO = {
        title,
        content,
        createdAt,
        ownerId,
        comments,
      };
      const result = await this.articleService.createArticle(userId, elements);
      res.status(201).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async modifyArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, ownerId } = req.body;
      const articleId = Number(req.params.id);
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unauthorized"); // 401

      const data: PatchArticleDTO = {
        title: String(title ?? ""),
        ownerId: userId,
        content: String(content ?? ""),
      };
      const result = await this.articleService.modifyArticle(
        articleId,
        userId,
        data
      );
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unauthorized"); // 401
      const articleId = Number(req.params?.id);
      const result = await this.articleService.deleteArticle(articleId, userId);
      res.status(200).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}
