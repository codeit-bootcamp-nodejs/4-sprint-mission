import express from "express";
import { AuthController } from "../controller/auth.controller.js";
import type { Request, Response, NextFunction } from "express";
import {
  authLoginSchema,
  authRegisterSchema,
} from "../validation/auth.validation.js";
import { validateQuery, validateBody } from "../middleWare/validateMiddle.js";
import passport from "passport";
import type { WebsocketService } from "socket/socket.js";

export default function createAuthRouter(wss: WebsocketService) {
  const router = express.Router();
  const authController = new AuthController(wss);
  // 로그인 API
  router.get(
    "/login",
    validateQuery(authLoginSchema),
    passport.authenticate("local", { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
      await authController.login(req, res, next);
    }
  );

  // 회원가입 API
  router.post(
    "/register",
    validateBody(authRegisterSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      await authController.register(req, res, next);
    }
  );

  return router;
}
