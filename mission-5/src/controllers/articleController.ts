import { BadRequestError } from '@/lib/errors.js';
import { hasId, hasIdAndUserId, hasParsedQuery, hasTokenPayload } from '@/types/guard.js';
import type { RequestHandler } from 'express';
import {
  deleteArticleLikeService,
  deleteArticleService,
  getArticleListService,
  getArticleService,
  patchArticleService,
  postArticleLikeService,
  postArticleService,
} from '../services/articleService.js';

class ArticleController {
  getArticle: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      // 토큰은 없어도 되니 이거로
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload || {};
    const result = await getArticleService({ userId, articleId });
    return res.status(200).json(result);
  };
  getArticleList: RequestHandler = async (req, res) => {
    if (!hasParsedQuery(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload || {};
    const result = await getArticleListService({ userId, ...req.parsedQuery });
    return res.status(200).json(result);
  };
  postArticle: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const result = await postArticleService({ userId, ...req.body });
    return res.status(201).json(result);
  };
  patchArticle: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await patchArticleService({ articleId, userId, data });
    return res.status(200).json(result);
  };
  deleteArticle: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await deleteArticleService({ articleId, userId });
    return res.status(200).json(result);
  };
  postArticleLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await postArticleLikeService({ userId, articleId });
    return res.status(201).json(result);
  };
  deleteArticleLike: RequestHandler = async (req, res) => {
    if (!hasIdAndUserId(req)) {
      throw new BadRequestError();
    }
    const { id: articleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await deleteArticleLikeService({ userId, articleId });
    return res.status(200).json(result);
  };
}
export default new ArticleController();
