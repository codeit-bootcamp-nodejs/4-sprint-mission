import express from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { createCommentController } from '../comments/create/create-comments.controller.js';
import { createArticleController } from './create/create-articles.controller.js';
import { deleteArticleController } from './delete/delete-articles.controller.js';
import { getArticlesController } from './get/get-articles.controller.js';
import { updateArticleController } from './update/update-articles.controller.js';

export const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(authenticate, createArticleController) // 게시글 등록
  .get(authenticate, getArticlesController); // 게시글 조회

articleRouter
  .route('/:articleId')
  .patch(authenticate, updateArticleController) // 게시글 수정
  .delete(authenticate, deleteArticleController); // 게시글 삭제

articleRouter
  .route('/:articleId/comments')
  .post(authenticate, createCommentController); // 게시글 댓글 작성
