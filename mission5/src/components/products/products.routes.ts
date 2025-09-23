// 상품 정보 수정
// 상품 삭제

import express from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { createCommentController } from '../comments/create/create-comments.controller.js';
import { createProductController } from './create/create-products.controller.js';
import { deleteProductController } from './delete/delete-products.controller.js';
import { getProductsController } from './get/get-products.controller.js';
import { updateProductController } from './update/update-products.controller.js';

export const productRouter = express.Router();

productRouter
  .route('/')
  .get(authenticate, getProductsController) // 상품 목록 조회
  .post(authenticate, createProductController); // 상품 등록

productRouter
  .route('/:productId')
  //   .get() // 상품 정보 상세 조회
  .patch(authenticate, updateProductController) // 상품 정보 수정
  .delete(authenticate, deleteProductController); // 상품 삭제

productRouter
  .route('/:productId/comments')
  .post(authenticate, createCommentController); // 게시글 댓글 작성
//   .get(); // 상품 댓글 조회
