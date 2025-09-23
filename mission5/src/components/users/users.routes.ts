import express from 'express';

import { authenticate } from '../../middlewares/authenticate.js';
import { createUserController } from './create/create-users.controller.js';
import { getLikedProductsController } from './get-liked-products-by-user/get-liked-products-by-user.controller.js';
import { getProductsByUserController } from './get-products-by-user/get-products-by-user.controller.js';
import { getUserController } from './get/get-users.controller.js';
import { updateUserPasswordController } from './update-password/update-users-password.controller.js';
import { updateUserController } from './update/update-users.controller.js';

export const userRouter = express.Router();

userRouter.route('/').post(createUserController); // 회원가입

userRouter
  .route('/me')
  .get(authenticate, getUserController) // 유저 본인 조회
  .patch(authenticate, updateUserController); // 본인 정보 수정

userRouter
  .route('/me/password')
  .put(authenticate, updateUserPasswordController); // 비밀번호 변경

userRouter.route('/me/products').get(authenticate, getProductsByUserController); // 본인이 등록한 상품 목록 조회

userRouter
  .route('/me/likes/products')
  .get(authenticate, getLikedProductsController); // 본인이 좋아요 누른 상품 목록
