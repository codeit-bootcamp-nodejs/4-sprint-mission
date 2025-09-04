import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import AuthController from "../controllers/authController.js";
import authValidator from "../middlewares/validation.middleware/authValidator.js";

const authRouter = express.Router();

// prettier-ignore
authRouter.route('/signup')
    .post(authValidator(), asyncHandler(AuthController.signup))
// prettier-ignore
authRouter.route('/login')
    .post(authValidator(), asyncHandler(AuthController.login))
// prettier-ignore
authRouter.route('/refresh')
    .post(asyncHandler(AuthController.refresh))

export default authRouter;
