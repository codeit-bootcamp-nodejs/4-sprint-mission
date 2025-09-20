import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../service/article-service';
import { LikeService } from '../service/like-service';

export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private likeService: LikeService,
  ) {}

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { title, content } = req.body;
      const newArticle = await this.articleService.createArticle(
        userId,
        title,
        content,
      );
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');
      const search = req.query.search as string;
      const userId = (req as any).user?.id;
      const result = await this.articleService.getArticles(
        page,
        limit,
        search,
        userId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const result = await this.articleService.getArticleById(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id } = req.params;
      const articleData = req.body;
      const updatedArticle = await this.articleService.updateArticle(
        userId,
        id,
        articleData,
      );
      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  };

  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id } = req.params;
      await this.articleService.deleteArticle(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as any).user;
      const { id: articleId } = req.params;
      const result = await this.likeService.toggleArticleLike(
        userId,
        parseInt(articleId),
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}