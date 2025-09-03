import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { validation } from '../middlewares/validation.js';
import passport from '../lib/passport/index.js';
import authenticate from '../middlewares/authenticate.js';
import { isUserSelf } from '../middlewares/authorize.js';

const router = express.Router();

// 등록
router.post('/register', validation.validateUsername, userController.register);

// 로그인&로그아웃
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/logout', userController.logout);

// 유저 조회
router.get('/:userId', authenticate, isUserSelf, userController.getUserProfile);

// 유저 비밀번호 수정
router.patch('/password', authenticate, userController.updatePassword);

// 유저 정보 수정
router.patch(
  '/:userId',
  authenticate,
  isUserSelf,
  userController.updateUserProfile
);

export default router;
