import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { productController } from '../controllers/product-controller.js';
import { validation } from '../middlewares/validation.js';
import passport from '../lib/passport/index.js';
import authenticate from '../middlewares/authenticate.js';
import { isUserSelf } from '../middlewares/authorize.js';
import { articleController } from '../controllers/article-controller.js';

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

// 유저 조회, 정보 수정
router
  .route('/:userId')
  .get(
    authenticate,
    isUserSelf,
    validation.validateParam('id', validation.idSchema),
    userController.getUserProfile
  )
  .patch(
    authenticate,
    isUserSelf,
    validation.validateParam('id', validation.idSchema),
    userController.updateUserProfile
  );

// 유저 비밀번호 수정
router.patch(
  '/password',
  authenticate,
  isUserSelf,
  userController.updatePassword
);

// 자신의 상품, 게시글, 댓글 조회

router.get(
  '/:userId/my-products',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  productController.getUserProducts
);
router.get(
  '/:userId/my-articles',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  articleController.getUserArticles
);
router.get(
  '/:userId/my-comments',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  userController.getUserComments
);

// 좋아요한 상품, 게시글, 댓글 조회

router.get(
  '/:userId/likes/products',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  userController.getUserLikedProducts
);

router.get(
  '/:userId/likes/articles',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  userController.getUserLikedArticles
);

router.get(
  '/:userId/likes/comments',
  authenticate,
  isUserSelf,
  validation.validateParam('id', validation.idSchema),
  userController.getUserLikedComments
);

export default router;
