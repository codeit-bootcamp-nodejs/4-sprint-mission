import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import AuthController from '../controllers/authController.js';
import { validateLoginBody, validateSignupBody } from '../middlewares/validators/authValidator.js';

const authRouter = express.Router();

// prettier-ignore
authRouter.route('/signup')
    .post(validateSignupBody, asyncHandler(AuthController.signup))
// prettier-ignore
authRouter.route('/login')
    .post(validateLoginBody, asyncHandler(AuthController.login))
// prettier-ignore
authRouter.route('/logout')
    .post(asyncHandler(AuthController.logout))
// prettier-ignore
authRouter.route('/refresh')
    .post(asyncHandler(AuthController.refresh))

export default authRouter;
