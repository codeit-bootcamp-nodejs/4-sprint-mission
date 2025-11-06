import express from 'express';
import asyncHandler from '@/middlewares/asyncHandler.js';
import { validatePatchUser } from '@/middlewares/validators/userValidator.js';
import authentication from '@/middlewares/authentication.js';
import container from '@/lib/inversify.config.js';
import { TYPES } from '@/types/layer.types.js';
import type { UserController } from '@/controllers/user.controller.js';

const userRouter = express.Router();

const userController = container.get<UserController>(TYPES.UserController);

userRouter
  .route('/')
  .get(authentication(), asyncHandler(userController.getUser))
  .patch(
    authentication(),
    validatePatchUser,
    asyncHandler(userController.patchUser),
  )
  .delete(authentication(), asyncHandler(userController.deleteUser));

userRouter
  .route('/products')
  .get(authentication(), asyncHandler(userController.getUserProductList));

userRouter
  .route('/articles')
  .get(authentication(), asyncHandler(userController.getUserArticleList));

userRouter
  .route('/products/comments')
  .get(
    authentication(),
    asyncHandler(userController.getUserProductCommentList),
  );

userRouter
  .route('/articles/comments')
  .get(
    authentication(),
    asyncHandler(userController.getUserArticleCommentList),
  );

userRouter
  .route('/products/likes')
  .get(authentication(), asyncHandler(userController.getUserProductLikeList));

userRouter
  .route('/articles/likes')
  .get(authentication(), asyncHandler(userController.getUserArticleLikeList));
export default userRouter;
