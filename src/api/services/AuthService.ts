import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { hashing, compareWords } from "../libs/hashing.js";
import { generateTokens } from "../libs/token.js";
import type { CustomError } from "src/api/types/error.js";
import * as AuthRepository from "../repositories/AuthRepository.js";
import type { SignupDto, LoginDto } from "../types/dtos/auth.dto.js";

const AuthService = {
  async signup(signupData: SignupDto) {
    // 이메일로 이미 존재하는 사용자인지 확인
    const existingUser = await AuthRepository.findByEmail(signupData.email);

    if (existingUser) {
      const error: CustomError = new Error("이미 가입된 이메일입니다.");
      error.statusCode = 409;
      throw error;
    }

    // 사용자 생성 전 비밀번호 해싱
    const hashedPassword = await hashing(signupData.password);

    // 사용자 생성
    const newUser = await AuthRepository.create({
      email: signupData.email,
      password: hashedPassword,
      nickname: signupData.nickname,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(loginData: LoginDto) {
    // 이메일로 존재하는 사용자인지 확인
    const user = await AuthRepository.findByEmail(loginData.email);

    if (!user) {
      const error: CustomError = new Error("가입되지 않은 사용자입니다");
      error.statusCode = 401;
      throw error;
    }

    // 비밀번호 일치 여부 확인
    const isPasswordVaild = await compareWords(loginData.password, user.password);

    if (!isPasswordVaild) {
      const error: CustomError = new Error("비밀번호가 일치하지 않습니다.");
      error.statusCode = 401;
      throw error;
    }

    // 액세스 토큰 및 리프레시 토큰 생성 및 해싱
    const { accessToken, refreshToken } = generateTokens(user.id);
    const hashedRefreshToken = await hashing(refreshToken);

    // DB에 리프레시 토큰 저장
    await AuthRepository.updateUserRefreshToken(user.id, hashedRefreshToken);

    const { password: _, ...userWithoutPassword } = user;
    // 테스트를 위해 refreshToken 출력
    return { userWithoutPassword, accessToken, refreshToken };
  },

  // AcessToken & RefreshToken을 재발급 받는 메서드
  async refreshAccessToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      const error: CustomError = new Error("Refresh Token이 제공되지 않았습니다.");
      error.statusCode = 401;
      throw error;
    }

    try {
      // 토큰 디코딩해서 토큰의 User 확인 및 변조 여부 확인
      const decoded = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET);
      if (typeof decoded === "string" || !decoded.id) {
        const error: CustomError = new Error("유효하지 않은 Refresh Token입니다.");
        error.statusCode = 403;
        throw error;
      }

      const userId = decoded.id;

      const user = await AuthRepository.findById(userId);

      if (!user) {
        const error: CustomError = new Error("해당하는 user가 없습니다. (Refresh Token 에러)");
        error.statusCode = 403;
        throw error;
      }

      // DB에 저장된 refreshToken 일치 여부 확인
      if (!user.refreshToken) {
        console.warn(`사용자 ${user.id}에게 저장된 리프레시 토큰이 없습니다. 제공된 토큰을 무효화합니다.`);
        return false;
      }

      const isTokenValid = await compareWords(oldRefreshToken, user.refreshToken);

      if (!isTokenValid) {
        const error: CustomError = new Error("유효하지 않은 Refresh Token입니다.");
        error.statusCode = 403;
        throw error;
      }

      // 새로운 Access Token, Refresh Token 생성
      const { accessToken, refreshToken } = generateTokens(user.id);
      const hashedNewRefreshToken = await hashing(refreshToken);

      await AuthRepository.updateUserRefreshToken(user.id, hashedNewRefreshToken);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error("Refresh Token 실제 오류:", err);
      if (err.name === "TokenExpiredError") {
        const error: CustomError = new Error("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        error.statusCode = 401;
        throw error;
      }
      const error: CustomError = new Error("Refresh Token 검증에 실패했습니다.");
      error.statusCode = 403;
      throw error;
    }
  },
};

export default AuthService;
