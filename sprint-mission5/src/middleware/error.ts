import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

function errorHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    }
    catch (e) {
      if (e instanceof ZodError) {
          res.status(400).json({ message: e.message || error.issues, issues: e.errors });
        } else if (e.name === 'StructError' || 
                   e.name === 'ValidationError' ||
                   e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError && 
        e.code === 'P2025') {
        res.status(404).send();
      } else {
        console.error(e);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  };
};

export { errorHandler };