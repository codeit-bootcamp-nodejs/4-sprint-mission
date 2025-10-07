import express from "express";
import { UserController } from "./user.controller.js";
import passport from "passport"
import { isAuthenticated } from "../middle_ware/auth.middleWare.js";

const router = express.Router();
const UC = new UserController();

// 자신이 등록한 상픔등록
router.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  (req, res) => UC.getUserProductListController(req, res)
);

//유저 정보 조회
router.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  (req, res) => UC.getUserInfoController(req, res)
);

// 유저 정보 변경
router.patch(
  "/me",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  (req, res) => UC.patchUserInfoController(req, res)
);

//유저 비밀번호 변경
router.patch(
  "/me/password",
  passport.authenticate("access-token", { session: false }),
  isAuthenticated,
  (req, res) => UC.patchUserPasswordController(req, res)
);

export default router;
