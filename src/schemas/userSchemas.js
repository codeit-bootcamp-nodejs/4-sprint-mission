import { z } from "zod";
import { safeString, intSafe, strictObject } from "../lib/zsec.js";

// 프로필 수정 검증
export const updateProfileBody = strictObject({
  nickname: safeString({
    min: 2,
    max: 30, // 닉네임 길이 제한
    label: "닉네임",
    trim: true,
    allowed: /^[a-zA-Z0-9_]+$/, // 영문, 숫자, 밑줄만 허용
  }).optional(),

  image: safeString({
    min: 10,
    max: 500, // URL 최대 길이 제한
    label: "이미지 URL",
    trim: true,
  })
    .pipe(
      z
        .string()
        .url("이미지 URL이 유효하지 않습니다.")
        .regex(
          /^https:\/\/cdn\.yourservice\.com\/avatars\//,
          "허용되지 않은 이미지 도메인입니다."
        )
    )
    .optional(),
});

// 비밀번호 변경 검증
export const changePasswordBody = strictObject({
  currentPassword: safeString({
    min: 8,
    max: 128, // OWASP 권장
    label: "현재 비밀번호",
  }).pipe(
    z
      .string()
      .regex(/[A-Z]/, "현재 비밀번호는 최소 1개의 대문자를 포함해야 합니다.")
      .regex(/[a-z]/, "현재 비밀번호는 최소 1개의 소문자를 포함해야 합니다.")
      .regex(/[0-9]/, "현재 비밀번호는 최소 1개의 숫자를 포함해야 합니다.")
      .regex(
        /[@$!%*?&]/,
        "현재 비밀번호는 최소 1개의 특수문자를 포함해야 합니다."
      )
  ),

  newPassword: safeString({
    min: 8,
    max: 128,
    label: "새로운 비밀번호",
  }).pipe(
    z
      .string()
      .regex(/[A-Z]/, "새로운 비밀번호는 최소 1개의 대문자를 포함해야 합니다.")
      .regex(/[a-z]/, "새로운 비밀번호는 최소 1개의 소문자를 포함해야 합니다.")
      .regex(/[0-9]/, "새로운 비밀번호는 최소 1개의 숫자를 포함해야 합니다.")
      .regex(
        /[@$!%*?&]/,
        "새로운 비밀번호는 최소 1개의 특수문자를 포함해야 합니다."
      )
  ),
});
