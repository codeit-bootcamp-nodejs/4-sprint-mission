import { Request, Response, NextFunction, RequestHandler } from 'express';
import prismaClient from '../lib/prismaClient';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';

function authenticate(options = { optional: false }): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      if (!user) {
        if (options.optional) {
          next();
          return;
        }
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      req.user = user;
    } catch (error) {
      if (options.optional) {
        next();
        return;
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };
}

export default authenticate;
