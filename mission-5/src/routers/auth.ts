import express from 'express';
import asyncHandler from '@middlewares/asyncHandler.js';
import { validateLoginBody, validateSignupBody } from '@middlewares/validators/authValidator.js';
import authentication from '@/middlewares/authentication.js';
import { authController } from '@lib/container.js';

const authRouter = express.Router();

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
