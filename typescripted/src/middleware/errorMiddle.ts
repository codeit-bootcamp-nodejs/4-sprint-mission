import { Request, Response, NextFunction } from "express";
import HttpError from "../lib/error"
import { ZodError } from "zod";

function error_handler(error: any, req: Request, res: Response, next: NextFunction){
    if (error instanceof ZodError) {
    return res.status(400).json({ success: false, errors: (error as ZodError).issues });
  }
   if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, message: error.message });
   }
    const status = error.status || 500;
    const message = error.message || "INTERNAL SERVER ERROR"
    return res.status(status).json({success:false,message:message})
}
export default error_handler