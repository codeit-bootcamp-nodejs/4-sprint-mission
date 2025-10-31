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
import type { CommentController } from '@/controllers/commentController.js';
import { TYPES } from '@/types/layer.types.js';

const commentRouter = express.Router();

const commentController = container.get<CommentController>(
  TYPES.CommentController,
);

// prettier-ignore
commentRouter.route('/')
    .get(validateGetListQuery, asyncHandler(commentController.getCommentList))
    .post(authentication(), validatePostBody, asyncHandler(commentController.postComment))

// prettier-ignore
commentRouter.route('/:id')
    .patch(authentication(), validateId, validatePatchBody, asyncHandler(commentController.patchComment))
    .delete(authentication(), validateId, asyncHandler(commentController.deleteComment))

export default commentRouter;
