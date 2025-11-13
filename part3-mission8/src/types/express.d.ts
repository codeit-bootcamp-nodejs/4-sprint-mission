import express from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
