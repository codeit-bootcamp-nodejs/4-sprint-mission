import { Request } from "express";
import { User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
      eamil?: string;
      nickname?: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: number;
        eamail: string; 
      };
    }
  }
}