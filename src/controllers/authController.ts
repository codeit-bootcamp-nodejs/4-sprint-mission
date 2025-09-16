import { generateTokens, verifyRefreshToken } from "../lib/token.js";
import { setTokenCookies, clearTokenCookies } from "../lib/cookies.js";
import { checkUserExists, createUser } from "../services/authService.js";
import {
  removeSensitiveFields,
  validateRefreshTokenCookie,
} from "../lib/utils.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "../lib/constants.js";
import type {
  RegisterController,
  LoginController,
} from "../types/controller/auth.controller.types.js";
import type { QueryGuard } from "../types/controller/queryGuard.controller.types.js";

// 회원가입
export const registerController: RegisterController = async (
  req,
  res,
  next
) => {
  try {
    const { email, nickname, password } = req.body;

    // 이메일 또는 닉네임 중복 여부 확인
    const existingUser = await checkUserExists({ email, nickname });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "이미 사용 중인 이메일 또는 닉네임입니다." });
    }

    // 새로운 사용자 생성
    const user = await createUser({ email, nickname, password });

    // 비밀번호는 응답에 포함하지 않음
    const safeUser = removeSensitiveFields(user);

    res
      .status(201)
      .json({ message: "User registered successfully", data: safeUser });
  } catch (error) {
    next(error);
  }
};

// 로그인
export const loginController: LoginController = async (req, res, next) => {
  try {
    // Passport 등 미들웨어로 인증 완료된 사용자 정보 확인
    if (!req.user) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }

    // JWT 토큰 생성 (accessToken, refreshToken)
    const { accessToken, refreshToken } = await generateTokens(req.user.id);

    // 쿠키에 토큰 저장 (httpOnly, secure 옵션 포함)
    setTokenCookies(res, accessToken, refreshToken);

    // 클라이언트에 토큰 전달 (필요에 따라 수정 가능)
    res.status(200).json({ token: `${accessToken}, ${refreshToken}` });
  } catch (error) {
    next(error);
  }
};

// 로그아웃
export const logoutController: QueryGuard = async (req, res, next) => {
  try {
    // 쿠키 삭제로 로그아웃 처리
    clearTokenCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// 토큰 재발급 (쿠키 기반)
export const refreshTokensController: QueryGuard = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!rawRefreshToken) {
      return res.status(401).json({ error: "Refresh token이 없습니다." });
    }
    // refreshToken은 기본 Passport 전략 대상이 아니므로
    // 직접 검증한다.
    const refreshToken = validateRefreshTokenCookie(rawRefreshToken);

    const payload = await verifyRefreshToken(refreshToken); // { userId } 반환
    if (!payload) {
      return res
        .status(401)
        .json({ error: "유효하지 않은 refresh token입니다." });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      payload.userId
    );

    // 새 토큰 쿠키에 저장
    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ message: "토큰이 재발급되었습니다.", accessToken });
  } catch (error) {
    next(error);
  }
};

// 구글 OAuth 콜백 처리
export const googleCallback: QueryGuard = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "사용자 인증에 실패했습니다." });
  }

  const userId = req.user.id;

  // 구글 로그인 성공 시 토큰 발급 및 쿠키 저장
  const { accessToken, refreshToken } = await generateTokens(userId);
  setTokenCookies(res, accessToken, refreshToken);

  // 클라이언트 메인 페이지로 리다이렉트
  res.redirect("/");
};
