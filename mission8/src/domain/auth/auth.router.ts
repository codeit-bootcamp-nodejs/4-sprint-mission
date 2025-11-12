import express from 'express';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authController } from './auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/refresh', authMiddleware, authController.refresh);
