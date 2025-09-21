import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as likeController from '../controllers/likeController.js';
import { setResourceType } from '../middlewares/resourceType.js';
import passport from '../config/passport.js';

const router = Router();

router.get('/profile', passport.authenticate('accessToken', { session: false }), userController.getUserProfile);
router.put('/me', passport.authenticate('accessToken', { session: false }), userController.updateMe);
router.put(
    '/me/password',
    passport.authenticate('accessToken', { session: false }),
    userController.updatePassword,
);

// 내 상품 목록 조회 (로그인 필요)
router.get(
    '/me/products',
    passport.authenticate('accessToken', { session: false }),
    userController.getMyProducts,
);

// 내 좋아요 상품 목록 조회 (로그인 필요)
router.get(
    '/me/likes/products',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('product'),
    likeController.getMyLikes,
);

// 내 좋아요 게시글 목록 조회 (로그인 필요)
router.get(
    '/me/likes/posts',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('post'),
    likeController.getMyLikes,
);

export default router;
