import { Request, Response, NextFunction } from 'express';
import { ArticlesService } from '../services/articles.service.js';

export class ArticlesController {
  articlesService = new ArticlesService();

  // 게시글 생성
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      if (!title || !content) {
        return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
      }

      const newArticle = await this.articlesService.createArticle(title, content, userId);

      return res.status(201).json({ data: newArticle });
    } catch (err) {
      next(err);
    }
  };

  // 게시글 목록 조회
  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await this.articlesService.getArticles();
      return res.status(200).json({ data: articles });
    } catch (err) {
      next(err);
    }
  };

  // 게시글 상세 조회
  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const user = req.user; // Optional user for isLiked check

      if (isNaN(parseInt(articleId))) {
        return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      }

      const article = await this.articlesService.getArticleById(+articleId, user?.id);

      return res.status(200).json({ data: article });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  };

  // 게시글 수정
  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const { title, content } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      const updatedArticle = await this.articlesService.updateArticle(+articleId, userId, title, content);

      return res.status(200).json({ data: updatedArticle });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "ForbiddenError") {
        return res.status(403).json({ message: err.message });
      }
      if (err.name === "BadRequestError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  };

  // 게시글 삭제 
  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      await this.articlesService.deleteArticle(+articleId, userId);

      return res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "ForbiddenError") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };

  // 게시글 좋아요/좋아요 취소
  toggleArticleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { articleId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const userId = user.id;

      const result = await this.articlesService.toggleArticleLike(+articleId, userId);

      return res.status(200).json(result);
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  };
}
