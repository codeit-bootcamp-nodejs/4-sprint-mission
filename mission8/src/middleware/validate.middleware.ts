import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

import { STATUS_CODE } from '../constants/constant.js';
import { HttpException } from '../utils/exception.js';
import logger from '../utils/logger.js';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validateMiddleware(schema: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as typeof req.query;
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as typeof req.params;
      }
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        logger.debug({
          message: 'Zod error',
          path: req.originalUrl,
          method: req.method,
          ip: req.ip,
          body: req.body,
          query: req.query,
          params: req.params,
        });
        const message = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new HttpException(STATUS_CODE.BAD_REQUEST, message));
      } else {
        next(err);
      }
    }
  };
}
