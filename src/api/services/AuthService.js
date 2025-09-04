import prisma from "../libs/prismaClient.js";
import jwt from "jsonwebtoken";
import { hashing, compareWords } from "../libs/hashing.js";
import { generateTokens } from "../libs/token.js";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const AuthService = {
  async signup(signupData) {
    // 이메일로 이미 존재하는 사용자인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });

    if (existingUser) {
      const error = new Error("이미 가입된 이메일입니다.");
      error.statusCode = 409;
      throw error;
    }

    // 사용자 생성 전 비밀번호 해싱
    const { email, nickname, password } = signupData;
    const hashedPassword = await hashing(password);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(loginData) {
    // 이메일로 존재하는 사용자인지 확인
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      const error = new Error("가입되지 않은 사용자입니다");
      error.statusCode = 401;
      throw error;
    }

    // 비밀번호 일치 여부 확인
    const isPasswordVaild = await compareWords(loginData.password, user.password);

    if (!isPasswordVaild) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.statusCode = 401;
      throw error;
    }

    // 액세스 토큰 및 리프레시 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id);

    // DB에 리프레시 토큰 저장
    const hashedRefreshToken = await hashing(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const { password: _, ...userWithoutPassword } = user;
    // 테스트를 위해 refreshToken 출력
    return { userWithoutPassword, accessToken, refreshToken };
  },

  // AcessToken & RefreshToken을 재발급 받는 메서드
  async refreshAccessToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      const error = new Error("Refresh Token이 제공되지 않았습니다.");
      error.statusCode = 401;
      throw error;
    }

    try {
      // 토큰 디코딩해서 토큰의 User 확인 및 변조 여부 확인
      const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
      const userId = decoded.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        const error = new Error("해당하는 user가 없습니다. (Refresh Token 에러)");
        error.statusCode = 403;
        throw error;
      }

      // DB에 저장된 refreshToken 일치 여부 확인
      const isTokenValid = await compareWords(oldRefreshToken, user.refreshToken);

      if (!isTokenValid) {
        const error = new Error("유효하지 않은 Refresh Token입니다.");
        error.statusCode = 403;
        throw error;
      }

      // 새로운 Access Token, Refresh Token 생성
      const { accessToken, refreshToken } = generateTokens(user.id);
      const hashedNewRefreshToken = await hashing(refreshToken);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedNewRefreshToken },
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.error("Refresh Token 실제 오류:", err);
      if (err.name === "TokenExpiredError") {
        const error = new Error("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        error.statusCode = 401;
        throw error;
      }
      const error = new Error("Refresh Token 검증에 실패했습니다.");
      error.statusCode = 403;
      throw error;
    }
  },
};

export default AuthService;
