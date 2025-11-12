import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import passport from '../config/passport.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', passport.authenticate('local', { session: false }), authController.login);
router.post('/logout', passport.authenticate('refreshToken', { session: false }), authController.logout);
router.post('/refresh', passport.authenticate('refreshToken', { session: false }), authController.refreshToken);

export default router;
