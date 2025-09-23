import express from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { deleteCommentController } from './delete/delete-comments.controller.js';
import { updateCommentController } from './update/update-comments.controller.js';

export const commentRouter = express.Router();

commentRouter
  .route('/:commentId')
  .patch(authenticate, updateCommentController) // 댓글 수정
  .delete(authenticate, deleteCommentController); // 댓글 삭제
