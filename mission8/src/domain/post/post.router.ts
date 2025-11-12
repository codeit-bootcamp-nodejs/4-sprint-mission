import express from 'express';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { commentController } from '../comment/comment.controller.js';

export const postRouter = express.Router();

postRouter.post('/:postId/comments', authMiddleware, commentController.create); // 게시글 댓글 추가
