import express from 'express';
import { userController } from '../controllers/user-controller.js';
import { validation } from '../middlewares/validation.js';
import passport from '../lib/passport/index.js';
import authenticate from '../middlewares/authenticate.js';
import { isUserSelf } from '../middlewares/authorize.js';

const router = express.Router();

router.post('/register', validation.validateUsername, userController.register);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/logout', userController.logout);
router.get('/:userId', authenticate, isUserSelf, userController.getUserProfile);
router.patch(
  '/:userId',
  authenticate,
  isUserSelf,
  userController.updateUserProfile
);

export default router;
