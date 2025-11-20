import express from 'express';
import { withAsync } from '../lib/withAsync';
import { signUp, signIn } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/signup', withAsync(signUp));
authRouter.post('/signin', withAsync(signIn));

export default authRouter;
