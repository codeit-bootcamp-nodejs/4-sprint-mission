import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import authentication from '@/middlewares/authentication.js';
import {
  validatePostBody,
  validatePatchBody,
  validateGetListQuery,
} from '@/middlewares/validators/commentValidator.js';
import { validateId } from '@/middlewares/validators/sharedValidator.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import { ArticleCommentController } from '@/controllers/article-comments.controller.js';

const articleCommentRouter = express.Router();

const articleCommentController = container.get<ArticleCommentController>(
  TYPES.ArticleCommentController,
);

articleCommentRouter
  .route('/')
  .get(
    validateGetListQuery,
    asyncHandler(articleCommentController.getCommentList),
  )
  .post(
    authentication(),
    validatePostBody,
    asyncHandler(articleCommentController.postComment),
  );

articleCommentRouter
  .route('/:id')
  .patch(
    authentication(),
    validateId,
    validatePatchBody,
    asyncHandler(articleCommentController.patchComment),
  )
  .delete(
    authentication(),
    validateId,
    asyncHandler(articleCommentController.deleteComment),
  );

export default articleCommentRouter;
