import express from 'express';

declare global {
  namespace Express {
    interface User {
      id: number; // prisma에서 id가 number면 number
      username: string;
      email: string;
    }

    interface Request {
      user?: User; // authenticate 미들웨어에서 세팅됨
    }
  }
}
