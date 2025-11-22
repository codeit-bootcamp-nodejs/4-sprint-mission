import { Router } from 'express';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import * as likeController from '../controllers/likeController.js';
import { setResourceType } from '../middlewares/resourceType.js';
import passport from '../config/passport.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.get('/:id', passport.authenticate('accessToken', { session: false }), postController.getPostById);
router.post('/', passport.authenticate('accessToken', { session: false }), postController.createPost);
router.put('/:id', passport.authenticate('accessToken', { session: false }), postController.updatePost);
router.delete('/:id', passport.authenticate('accessToken', { session: false }), postController.deletePost);

// 특정 게시글에 대한 댓글 생성 및 조회 경로
router.post(
    '/:id/comments',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('post'),
    commentController.createComment,
);

router.get('/:id/comments', setResourceType('post'), commentController.getCommentsByResourceId);

// 특정 게시글에 대한 좋아요 생성 및 취소 경로
router.post(
    '/:id/likes',
    passport.authenticate('accessToken', { session: false }),
    setResourceType('post'),
    likeController.toggleLike,
);

export default router;
