import Express from 'express'; 

declare global {
  namespace Express {
    interface User{
      id?: number,
      email: string|null,
      nickname :string | null,
      password: string | null,
    }
    interface Request {
      user?: User;
    }
  }
}
