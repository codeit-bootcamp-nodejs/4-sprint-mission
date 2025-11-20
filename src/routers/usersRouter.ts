import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  getMe,
  updateMe,
  updateMyPassword,
  getMyProductList,
  getMyFavoriteList,
  getMyNotifications,
} from '../controllers/usersController';
import authenticate from '../middlewares/authenticate';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate(), withAsync(getMe));
usersRouter.patch('/me', authenticate(), withAsync(updateMe));
usersRouter.patch('/me/password', authenticate(), withAsync(updateMyPassword));
usersRouter.get('/me/products', authenticate(), withAsync(getMyProductList));
usersRouter.get('/me/favorites', authenticate(), withAsync(getMyFavoriteList));
usersRouter.get('/me/notifications', authenticate(), withAsync(getMyNotifications));

export default usersRouter;
