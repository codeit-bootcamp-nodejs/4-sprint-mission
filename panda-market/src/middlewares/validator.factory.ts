import type { ValidationFn } from '@/types/validator.types.js';
import type { RequestHandler } from 'express';

export default function createValidator(
  validateFn: ValidationFn,
): RequestHandler {
  return (req, _res, next) => {
    try {
      validateFn(req);
      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
