import { Request } from "express";
import { AuthenticatedUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      file?: Multer.File;
    }
  }
}
