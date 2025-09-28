import { BadRequestError } from '@lib/errors.js';
import { hasId, hasIdAndUserId, hasParsedQuery, hasTokenPayload } from '@/types/guard.js';
import type { RequestHandler } from 'express';
import type { ArticleService } from '@services/articleService.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/layer.types.js';

@injectable()
export class ArticleController {
  constructor(@inject(TYPES.ArticleService) private readonly articleService: ArticleService) {}

  getArticle: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      // 토큰은 없어도 되니 이거로
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload || {};
    const result = await this.articleService.getArticle({ userId, articleId });
    return res.status(200).json(result);
  };
  getArticleList: RequestHandler = async (req, res) => {
    if (!hasParsedQuery(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload || {};
    const result = await this.articleService.getArticleList({ userId, ...req.parsedQuery });
    return res.status(200).json(result);
  };
  postArticle: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const result = await this.articleService.postArticle({ userId, ...req.body });
    return res.status(201).json(result);
  };
  patchArticle: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await this.articleService.patchArticle({ articleId, userId, data });
    return res.status(200).json(result);
  };
  deleteArticle: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.articleService.deleteArticle({ articleId, userId });
    return res.status(200).json(result);
  };
  postArticleLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.articleService.postArticleLike({ userId, articleId });
    return res.status(201).json(result);
  };
  deleteArticleLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await this.articleService.deleteArticleLike({ userId, articleId });
    return res.status(200).json(result);
  };
}
