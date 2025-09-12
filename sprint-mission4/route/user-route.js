import express from 'express';
import UserService from '../service/user-service.js';
import auth from '../middleware/auth.js'
import zod from '../middleware/zod.js';


const router = express.Router();

// 회원가입 라우터
router
  .route('/join')
  .post(zod.CreateUserId, UserService.createUsers)

// 로그인 라우터
router
  .route('/login')
  .post(UserService.login)

router
  .route('/users/:userId')
  .get(auth.verifyAccessToken, auth.verifyUserRole, UserService.getUserById)
  .patch(auth.verifyAccessToken, auth.verifyUserRole, UserService.updateUsers)

router
  .route('/users/:userId/products')
  .get(auth.verifyAccessToken, auth.verifyUserRole, UserService.getProductsByUserId)


export default router;