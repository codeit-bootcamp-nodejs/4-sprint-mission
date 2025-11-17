import type { Request, Response, NextFunction } from "express";
import express from "express";
import passport from "passport";
import { UserController } from "../controller/user.controller.js";
import {
  updateUserInfoSchema,
  changePasswordSchema,
} from "../validation/user.validation.js";
import { validateBody } from "../middleWare/validateMiddle.js";

const router = express.Router();
const userController = new UserController();
// 자신이 등록한 상픔 목록 조회
router.get(
  "/me/products",
  passport.authenticate("local", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.accessUserProducts(req, res, next);
  }
);

// 유저 정보 조회
router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  await userController.accessUserInfo(req, res, next);
});

// 유저 정보 변경
router.patch(
  "/me",
  validateBody(updateUserInfoSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.modifyUserInfo(req, res, next);
  }
);

//유저 비밀번호 변경
router.patch(
  "/me/password",
  validateBody(changePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.modifyUserPassword(req, res, next);
  }
);

export default router;
