import express from 'express';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { commentController } from '../comment/comment.controller.js';
import { commentSchema } from '../comment/comment.schema.js';

export const postRouter = express.Router();

postRouter.post(
  '/:postId/comments',
  authMiddleware,
  validateMiddleware(commentSchema.createComment),
  commentController.create,
); // 게시글 댓글 추가
