import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController';
import { withAsync } from '../lib/withAsync';

const authRouter = express.Router();

authRouter.post('/register', withAsync(register));
authRouter.post('/signup', withAsync(register)); // Alias for register
authRouter.post('/login', withAsync(login));
authRouter.post('/signin', withAsync(login)); // Alias for login
authRouter.post('/logout', withAsync(logout));
authRouter.post('/signout', withAsync(logout)); // Alias for logout
authRouter.post('/refresh', withAsync(refreshToken));

export default authRouter;
