import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname: string;
      image?: string | null;
      createdAt: Date;
      updatedAt?: Date;
    }

    interface Request {
      user?: User;
    }
  }

  interface HttpError extends Error {
    status?: number;
    code?: string;
  }
}

export {};
