import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import {
  validateLoginBody,
  validateSignupBody,
} from '@/middlewares/validators/authValidator.js';
import { authentication } from '@/middlewares/authentication.js';
import container from '@/lib/inversify.config.js';
import { AuthController } from '@/controllers/auth.controller.js';
import { TYPES } from '@/types/layer.types.js';

const authRouter = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

authRouter
  .route('/signup')
  .post(validateSignupBody, asyncHandler(authController.signup));

authRouter
  .route('/login')
  .post(validateLoginBody, asyncHandler(authController.login));

authRouter.route('/google').get(asyncHandler(authController.googleLogin));

authRouter.route('/kakao').get(asyncHandler(authController.kakaoLogin));

authRouter
  .route('/google/callback')
  .get(asyncHandler(authController.googleLoginCallback));

authRouter
  .route('/kakao/callback')
  .get(asyncHandler(authController.kakaoLoginCallback));

authRouter
  .route('/logout')
  .post(authentication(), asyncHandler(authController.logout));

authRouter.route('/refresh').post(asyncHandler(authController.refresh));

export default authRouter;
