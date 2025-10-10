import { User } from '@prisma/client';

type AuthUser = Omit<User, 'password'>;

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUser;
    }
  }
}