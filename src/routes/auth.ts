import express from "express";
import {
  signup,
  signupValidation,
  login,
  loginValidation,
  refreshTokens,
  logout,
} from "../controllers/authController";

const router = express.Router();

// express에서 제공하는 Request 타입과 직접 만드신 AuthenticatedRequest 타입이 충돌해서 생기는 문제...
// 이걸 해결하는 방법이 여러가지가 있음...
// 1. declare global을 사용해서 Express Request의 타입을 전역적으로 수정 및 확장 -> 저는 추천하지 않음.
// 2. Response의 타입에 있는 Locals 객체를 사용하는 방법이 있음.

// 회원가입
router.post("/signup", signupValidation, signup);

// 로그인
router.post("/login", loginValidation, login);

// 토큰 갱신
router.post("/refresh", refreshTokens);

// 로그아웃
router.post("/logout", logout);

export default router;
