import express from 'express';

import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { authController } from './auth.controller.js';
import { authSchema } from './auth.schema.js';

export const authRouter = express.Router();

authRouter.post('/login', validateMiddleware(authSchema.login), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/register', validateMiddleware(authSchema.register), authController.register);
