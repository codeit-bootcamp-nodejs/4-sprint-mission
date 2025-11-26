import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController';
import { withAsync } from '../lib/withAsync';

const authRouter = express.Router();

authRouter.post('/register', withAsync(register));
authRouter.post('/login', withAsync(login));
authRouter.post('/logout', withAsync(logout));
authRouter.post('/refresh', withAsync(refreshToken));

export default authRouter;
