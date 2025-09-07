import express from "express";
import passport from "../lib/passport/index.js";
import {
  register,
  login,
  logout,
  refreshTokens,
  googleCallback,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/authValidation.js";

const router = express.Router();

// 회원가입
router.post("/register", validateRegister, register);

// 로컬 로그인 (닉네임과 비밀번호 인증)
router.post(
  "/login",
  validateLogin,
  passport.authenticate("local", { session: false }),
  login
);

// 로그아웃
router.post(
  "/logout",
  passport.authenticate("access-token", { session: false }),
  logout
);

// 토큰 재발급
router.post("/refresh", refreshTokens);

// 구글 OAuth 로그인 시작 (이메일과 프로필 정보 요청)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// 구글 OAuth 콜백 (로그인 성공 시 토큰 발급)
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
