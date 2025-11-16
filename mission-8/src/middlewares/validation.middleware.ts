import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.js';

export const validationMiddleware = (type: any, skipMissingProperties = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validate(plainToInstance(type, req.body), { skipMissingProperties });
    if (errors.length > 0) {
      const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(', ');
      next(new HttpError(400, message));
    } else {
      next();
    }
  };
};
