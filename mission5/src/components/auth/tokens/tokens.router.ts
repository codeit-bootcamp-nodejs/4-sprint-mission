import express from 'express';
import { refreshTokenController } from './tokens.controller.js';

export const tokenRouter = express.Router();

tokenRouter.route('/refresh').post(refreshTokenController); // 토큰 재발급
