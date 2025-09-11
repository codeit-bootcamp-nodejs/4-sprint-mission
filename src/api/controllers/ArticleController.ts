import ArticleService from "../services/ArticleService.js";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import env from "../config/env.js";
import type { CustomError } from "src/api/types/error.js";

const ArticleController = {
  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).send("제목과 게시글을 입력해주세요.");
      }
      const articleData = { title, content };
      const newArticle = await ArticleService.createArticle(articleData, userId);

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
          const decoded = jwt.verify(token, env.JWT_SECRET);
          if (typeof decoded === "string" || !decoded.id) {
            const error: CustomError = new Error("유효하지 않은 Token입니다.");
            error.statusCode = 403;
            throw error;
          }
          userId = decoded.userId;
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

  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const updateData = req.body;
      const article = await ArticleService.updateArticle(Number(id), updateData, userId);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  },

  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      await ArticleService.deleteArticle(Number(id), userId);
      res.status(201).json({ success: "상품 삭제 성공" });
    } catch (err) {
      next(err);
    }
  },

  async findManyArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset = 0, limit = 10, order, keyword } = req.query;

      const finalOffset = Number(offset) || 0;
      const finalLimit = Number(limit) || 10;
      const finalOrder = typeof order === "string" ? order : "recent";
      const finalKeyword = typeof keyword === "string" ? keyword : undefined;

      const articles = await ArticleService.findManyArticle({
        offset: finalOffset,
        limit: finalLimit,
        order: finalOrder,
        ...(finalKeyword && { keyword: finalKeyword }),
      });
      res.status(200).json(articles);
    } catch (err) {
      next(err);
    }
  },
};

export default ArticleController;
