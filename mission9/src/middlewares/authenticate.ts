import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import * as authService from '../services/authService';

function authenticate(options = { optional: false }): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    try {
      const user = await authService.authenticate(accessToken);
      req.user = user;
    } catch (error) {
      if (options.optional) {
        next();
        return;
      }
      next(error);
      return;
    }
    next();
  };
}

export default authenticate;
