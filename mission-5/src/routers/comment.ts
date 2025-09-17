import express from 'express';
import asyncHandler from '@middlewares/asyncHandler.js';
import authentication from '@middlewares/authentication.js';
import {
  validatePostBody,
  validatePatchBody,
  validateGetListQuery,
} from '@middlewares/validators/commentValidator.js';
import { validateId } from '@middlewares/validators/sharedValidator.js';
import { commentController } from '@lib/container.js';

const commentRouter = express.Router();

// prettier-ignore
commentRouter.route('/')
    .get(validateGetListQuery, asyncHandler(commentController.getCommentList))
    .post(authentication(), validatePostBody, asyncHandler(commentController.postComment))

// prettier-ignore
commentRouter.route('/:id')
    .patch(authentication(), validateId, validatePatchBody, asyncHandler(commentController.patchComment))
    .delete(authentication(), validateId, asyncHandler(commentController.deleteComment))

export default commentRouter;
