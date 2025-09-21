import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import * as commentController from '../controllers/commentController.js';
import * as likeController from '../controllers/likeController.js';
import { setResourceType } from '../middlewares/resourceType.js';
import passport from '../config/passport.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', passport.authenticate('accessToken', { session: false }), productController.getProductById);
router.post('/', passport.authenticate('accessToken', { session: false }), productController.createProduct);
router.put('/:id', passport.authenticate('accessToken', { session: false }), productController.updateProduct);
router.delete('/:id', passport.authenticate('accessToken', { session: false }), productController.deleteProduct);

// 특정 상품에 대한 댓글 생성 및 조회 경로
router.post(
    '/:id/comments',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('product'),
    commentController.createComment,
);

router.get('/:id/comments', setResourceType('product'), commentController.getCommentsByResourceId);

// 특정 상품에 대한 좋아요 생성 및 취소 경로
router.post(
    '/:id/likes',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('product'),
    likeController.toggleLike,
);

export default router;
