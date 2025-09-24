import ArticleService from "../services/article/article.service.js";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../libs/constants.js";
import type { CustomError } from "src/api/types/error.js";
import type { RequestWithDto } from "../types/express.d.ts";
import type { ArticleDto } from "../services/article/article.dto.js";
import { FindManyParamsDto } from "../types/dto.js";

const ArticleController = {
  async createArticle(req: RequestWithDto<ArticleDto>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const articleDto = req.body;
      const newArticle = await ArticleService.createArticle(articleDto, userId);

      res.status(201).json(newArticle);
    } catch (err) {
      next(err);
    }
  },

  async findUniqueArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const articleId = Number(id);

      let userId = null;
      const token = req.cookies.accessToken;

      if (token) {
        try {
          const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
          if (typeof decoded === "string" || !decoded.id) {
            const error: CustomError = new Error("유효하지 않은 Token입니다.");
            error.statusCode = 403;
            throw error;
          }
          userId = decoded.id;
        } catch (err) {
          console.error("토큰 검증 오류:", err);
        }
      }
      const article = await ArticleService.findUniqueArticle(articleId, userId);
      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  },

  async updateArticle(req: RequestWithDto<ArticleDto>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const { id } = req.params;
      const articleDto = req.body;

      const article = await ArticleService.updateArticle(Number(id), articleDto, userId);
      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  },

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        const error: CustomError = new Error("인증이 필요합니다.");
        error.statusCode = 401;
        throw error;
      }
      const { id: userId } = req.user;
      const { id } = req.params;
      await ArticleService.deleteArticle(Number(id), userId);
      res.status(200).json({ success: "상품 삭제 성공" });
    } catch (err) {
      next(err);
    }
  },

  async findManyArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const params = FindManyParamsDto.from(req.query);

      const articles = await ArticleService.findManyArticle(params);
      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  },
};

export default ArticleController;
