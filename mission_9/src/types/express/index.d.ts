import "express";
import type { JwtPayload } from "../auth.d.js";

declare module "express-serve-static-core" {
  interface Request {
    // user?: import("../types/auth").JwtPayload;
    user?: JwtPayload;
    auth?: JwtPayload;
  }
}
