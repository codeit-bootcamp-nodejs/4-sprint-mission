import express from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { toggleArticleLikeController } from './articles-like/toggle-articles-like.controller.js';
import { toggleProductLikeController } from './products-like/toggle-products-like.controller.js';

export const likeRouter = express.Router();

likeRouter.post(
  '/products/:productId',
  authenticate,
  toggleProductLikeController,
); // 상품 좋아요 토글
likeRouter.post(
  '/articles/:articleId',
  authenticate,
  toggleArticleLikeController,
); // 게시글 좋아요 토글
