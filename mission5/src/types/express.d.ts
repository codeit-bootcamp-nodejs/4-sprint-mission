import 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }

    interface Request {
      user: User;
    }
  }
}
