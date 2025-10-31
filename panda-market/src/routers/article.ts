import express from 'express';
import commentRouter from './comment.js';
import parentIdParser from '@/middlewares/parnetIdParser.js';
import asyncHandler from '@/middlewares/asyncHandler.js';
import {
  validatePatchBody,
  validatePostBody,
} from '@/middlewares/validators/articleValidator.js';
import authentication from '@/middlewares/authentication.js';
import optionalAuthentication from '@/middlewares/optionalAuthentication.js';
import {
  validateGetListQuery,
  validateId,
} from '@/middlewares/validators/sharedValidator.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import type { ArticleController } from '@/controllers/articleController.js';

const articleRouter = express.Router();

const articleController = container.get<ArticleController>(
  TYPES.ArticleController,
);

articleRouter.use('/:id/comment', parentIdParser, commentRouter);

// prettier-ignore
articleRouter.route('/')
    .get(optionalAuthentication(), validateGetListQuery, asyncHandler(articleController.getArticleList))
    .post(authentication(), validatePostBody, asyncHandler(articleController.postArticle))

// prettier-ignore
articleRouter.route("/:id")
  .get(optionalAuthentication(), validateId, asyncHandler(articleController.getArticle))
  .patch(authentication(), validateId, validatePatchBody, asyncHandler(articleController.patchArticle))
  .delete(authentication(), validateId, asyncHandler(articleController.deleteArticle));

// prettier-ignore
articleRouter.route("/:id/likes")
  .post(authentication(), validateId, asyncHandler(articleController.postArticleLike))
  .delete(authentication(), validateId, asyncHandler(articleController.deleteArticleLike))

export default articleRouter;
