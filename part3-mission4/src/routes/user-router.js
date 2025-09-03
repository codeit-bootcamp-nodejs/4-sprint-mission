import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { validation } from '../middlewares/validation.js';
import passport from '../lib/passport/index.js';

const router = express.Router();

router.post('/register', validation.validateUsername, userController.register);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/logout', userController.logout);

export default router;
