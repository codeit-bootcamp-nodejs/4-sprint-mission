import { Router } from 'express';
import * as likeController from '../controllers/likeController.js';
import passport from '../config/passport.js';

const router = Router();

router.get(
    '/',
    passport.authenticate('accessToken', { session: false }),
    likeController.getAllLikes,
);

export default router;