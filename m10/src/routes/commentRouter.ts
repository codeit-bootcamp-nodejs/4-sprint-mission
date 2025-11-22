import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import passport from '../config/passport.js';

const router = Router();

router.get('/:id', commentController.getCommentById);
router.put('/:id', passport.authenticate('accessToken', { session: false }), commentController.updateComment);
router.delete('/:id', passport.authenticate('accessToken', { session: false }), commentController.deleteComment);

export default router;
