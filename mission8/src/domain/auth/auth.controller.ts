import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import type { registerInputData } from './auth.type.js';
import { authLoginService } from './auth-login.service.js';
import { authRefreshService } from './auth-refresh.service.js';
import { authRegisterService } from './auth-register.service.js';

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerData: registerInputData = req.body;
      const result = await authRegisterService(registerData);
      return res.status(STATUS_CODE.CREATED).json(result);
    } catch (err) {
      return next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authLoginService(email, password);
      return res.status(STATUS_CODE.OK).json(result);
    } catch (err) {
      return next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidToken);
      }
      const decoded = jwt.verify(refreshToken, authConfig.refreshTokenSecretKey) as { userId: number };

      const newAccessToken = await authRefreshService(decoded.userId, refreshToken);
      return res.status(STATUS_CODE.OK).json({ accessToken: newAccessToken });
    } catch (err) {
      return next(err);
    }
  };
}

export const authController = new AuthController();
