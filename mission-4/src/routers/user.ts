import express from 'express';
import asyncHandler from '@middlewares/asyncHandler.js';
import UserController from '@controllers/userController.js';
import {
  validateGetUserContent,
  validatePatchUser,
} from '@middlewares/validators/userValidator.js';
import authentication from '@middlewares/authentication.js';

const userRouter = express.Router();

// prettier-ignore
userRouter.route("/")
  .get(authentication(), asyncHandler(UserController.getUser))
  .patch(authentication(), validatePatchUser, asyncHandler(UserController.patchUser))
  .delete(authentication(), asyncHandler(UserController.deleteUser));

// prettier-ignore
userRouter.route("/:content")
  .get(authentication(), validateGetUserContent, asyncHandler(UserController.getUserContentList))

// prettier-ignore
userRouter.route("/:content/likes")
  .get(authentication(), validateGetUserContent, asyncHandler(UserController.getUserContentLikeList))
export default userRouter;
