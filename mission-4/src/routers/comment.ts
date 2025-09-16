import express from 'express';
import CommentController from '@controllers/commentController.js';
import asyncHandler from '@middlewares/asyncHandler.js';
import authentication from '@middlewares/authentication.js';
import {
  validatePostBody,
  validatePatchBody,
  validateGetListQuery,
} from '@middlewares/validators/commentValidator.js';
import { validateId } from '@middlewares/validators/sharedValidator.js';

const commentRouter = express.Router();

// prettier-ignore
commentRouter.route('/')
    .get(validateGetListQuery, asyncHandler(CommentController.getCommentList))
    .post(authentication(), validatePostBody, asyncHandler(CommentController.postComment))

// prettier-ignore
commentRouter.route('/:id')
    .patch(authentication(), validateId, validatePatchBody, asyncHandler(CommentController.patchComment))
    .delete(authentication(), validateId, asyncHandler(CommentController.deleteComment))

export default commentRouter;
