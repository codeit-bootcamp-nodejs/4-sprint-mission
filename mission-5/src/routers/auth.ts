import express from 'express';
import asyncHandler from '@middlewares/asyncHandler.js';
import { validateLoginBody, validateSignupBody } from '@middlewares/validators/authValidator.js';
import authentication from '@/middlewares/authentication.js';
import container from '@lib/inversify.config.js';
import { AuthController } from '@controllers/authController.js';
import { TYPES } from '@/types/layer.types.js';

const authRouter = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

// prettier-ignore
authRouter.route('/signup')
    .post(validateSignupBody, asyncHandler(authController.signup))
// prettier-ignore
authRouter.route('/login')
    .post(validateLoginBody, asyncHandler(authController.login))
// prettier-ignore
authRouter.route('/logout')
    .post(authentication(), asyncHandler(authController.logout))
// prettier-ignore
authRouter.route('/refresh')
    .post(asyncHandler(authController.refresh))

export default authRouter;
