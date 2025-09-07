import { z } from "zod";
import { safeString, strictObject } from "../lib/zsec.js";

// 회원가입 검증
export const registerSchema = strictObject({
  email: z.string().min(5).max(254).email("유효한 이메일을 입력해주세요."),
  nickname: safeString({
    min: 2,
    max: 30, // 서비스 정책에 맞게 제한
    label: "nickname",
    allowed: /^[a-zA-Z0-9_]+$/, // 영문, 숫자, 밑줄만 허용
    trim: true,
  }),
  password: safeString({
    min: 8,
    max: 128, // OWASP 권장 최대 길이
    label: "password",
    trim: false, // 공백 허용 여부는 정책에 따라
  }).pipe(
    z
      .string()
      .regex(/[A-Z]/, "비밀번호는 최소 1개의 대문자를 포함해야 합니다.")
      .regex(/[a-z]/, "비밀번호는 최소 1개의 소문자를 포함해야 합니다.")
      .regex(/[0-9]/, "비밀번호는 최소 1개의 숫자를 포함해야 합니다.")
      .regex(/[@$!%*?&]/, "비밀번호는 최소 1개의 특수문자를 포함해야 합니다.")
  ),
});

// 로그인 검증
export const loginSchema = strictObject({
  nickname: safeString({
    min: 2,
    max: 30, // 서비스 정책에 맞게 제한
    label: "nickname",
    allowed: /^[a-zA-Z0-9_]+$/, // 영문, 숫자, 밑줄만 허용
    trim: true,
  }),
  password: safeString({
    min: 8,
    max: 128,
    label: "password",
    trim: false,
  }),
});

// 토큰 리프레시 검증
export const refreshTokenSchema = strictObject({
  refreshToken: safeString({
    min: 20, // 너무 짧은 토큰은 차단
    max: 2000, // JWT + 서명 고려
    label: "refreshToken",
  }).pipe(
    z
      .string()
      .regex(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        "유효한 JWT 형식의 refreshToken이어야 합니다."
      )
  ),
});
