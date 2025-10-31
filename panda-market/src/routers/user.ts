import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import {
  validateGetUserContent,
  validatePatchUser,
} from '@/middlewares/validators/userValidator.js';
import authentication from '@/middlewares/authentication.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import type { UserController } from '@/controllers/userController.js';

const userRouter = express.Router();

const userController = container.get<UserController>(TYPES.UserController);

// prettier-ignore
userRouter.route("/")
  .get(authentication(), asyncHandler(userController.getUser))
  .patch(authentication(), validatePatchUser, asyncHandler(userController.patchUser))
  .delete(authentication(), asyncHandler(userController.deleteUser));

// prettier-ignore
userRouter.route("/:content")
  .get(authentication(), validateGetUserContent, asyncHandler(userController.getUserContentList))

// prettier-ignore
userRouter.route("/:content/likes")
  .get(authentication(), validateGetUserContent, asyncHandler(userController.getUserContentLikeList))
export default userRouter;
