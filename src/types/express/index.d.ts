import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    user?: User | null;
  }
}
