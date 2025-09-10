import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = (userController) => {
  const router = express.Router();

  router.post('/signup', userController.signUp);
  router.post('/signin', userController.signIn);

  // '내 정보' 관련 라우트 추가
  router
    .route('/me')
    .get(authMiddleware, userController.getMyInfo) // 내 정보 조회
    .patch(authMiddleware, userController.updateMyInfo); // 내 정보 수정

  router.patch('/me/password', authMiddleware, userController.changeMyPassword);
  router.get('/me/products', authMiddleware, userController.getMyProducts);

  return router;
};

export default userRouter;
