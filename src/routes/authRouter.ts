import express from "express";
import passport from "../lib/passport/index.js";
import {
  registerController,
  loginController,
  logoutController,
  refreshTokensController,
  googleCallback,
} from "../controllers/authController.js";
import {
  validateRegisterBody,
  validateLoginBody,
} from "../middlewares/authValidation.js";
import { queryGuard } from "../middlewares/queryGuard.js";

const router = express.Router();

// 회원가입
router.post("/register", validateRegisterBody, registerController);

// 로컬 로그인 (닉네임과 비밀번호 인증)
router.post(
  "/login",
  validateLoginBody,
  passport.authenticate("local", { session: false }),
  loginController
);

// 로그아웃
router.post(
  "/logout",
  queryGuard,
  passport.authenticate("access-token", { session: false }),
  logoutController
);

// 토큰 재발급
router.post("/refresh", queryGuard, refreshTokensController);

// 구글 OAuth 로그인 시작 (이메일과 프로필 정보 요청)
router.get(
  "/google",
  queryGuard,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// 구글 OAuth 콜백 (로그인 성공 시 토큰 발급)
router.get(
  "/google/callback",
  queryGuard,
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
