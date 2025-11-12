import type { NextFunction, Request, Response } from 'express';

import { STATUS_CODE } from '../../constants/constant.js';
import { authLoginService } from './auth-login.service.js';
import { authRefreshService } from './auth-refresh.service.js';

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authLoginService(email, password);
      return res.status(STATUS_CODE.SUCCESS).json(result);
    } catch (err) {
      return next(err);
    }
  };

  refresh = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId;
      const refreshToken = req.body.refreshToken;
      const newAccessToken = await authRefreshService(userId, refreshToken);
      return newAccessToken;
    } catch (err) {
      return next(err);
    }
  };
}

export const authController = new AuthController();
