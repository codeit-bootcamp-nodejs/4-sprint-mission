import express from 'express';
import commentRouter from './comment.js';
import parentIdParser from '../middlewares/parnetIdParser.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ArticleController from '../controllers/articleController.js';
import { validatePatchBody, validatePostBody } from '../middlewares/validators/articleValidator.js';
import authentication from '../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';
import optionalAuthentication from '../middlewares/optionalAuthentication.js';
import { validateGetListQuery, validateId } from '../middlewares/validators/sharedValidator.js';

const articleRouter = express.Router();

articleRouter.use('/:id/comment', parentIdParser, commentRouter);

// prettier-ignore
articleRouter.route('/')
    .get(optionalAuthentication(), validateGetListQuery, asyncHandler(ArticleController.getArticleList))
    .post(authentication(), validatePostBody, asyncHandler(ArticleController.postArticle))

// prettier-ignore
articleRouter.route("/:id")
  .get(optionalAuthentication(), validateId, asyncHandler(ArticleController.getArticle))
  .patch(authentication(), validateId, validatePatchBody, authorization('article'), asyncHandler(ArticleController.patchArticle))
  .delete(authentication(), validateId, authorization('article'), asyncHandler(ArticleController.deleteArticle));

// prettier-ignore
articleRouter.route("/:id/likes")
  .post(authentication(), validateId, asyncHandler(ArticleController.postArticleLike))
  .delete(authentication(), validateId, asyncHandler(ArticleController.deleteArticleLike))

export default articleRouter;
