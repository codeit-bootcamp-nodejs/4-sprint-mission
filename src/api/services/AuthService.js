import prisma from "../libs/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashing } from "../libs/hashing.js";
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
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });
    if (!user) {
      const error = new Error("가입되지 않은 사용자입니다");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordVaild = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordVaild) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.statusCode = 401;
      throw error;
    }

    // 액세스 토큰 및 리프레시 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id);

    const hashedRefreshToken = await hashing(refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const { password: _, ...userWithoutPassword } = user;
    // 테스트를 위해 refreshToken 출력
    return { userWithoutPassword, accessToken, refreshToken };
  },

  // AcessToken & RefreshToken을 재발급 받는 코드
  async refreshAccessToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      const error = new Error("Refresh Token이 제공되지 않았습니다.");
      error.statusCode = 401;
      throw error;
    }

    const hashedOldRefreshToken = await hashing(oldRefreshToken);

    try {
      const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.refreshToken !== hashedOldRefreshToken) {
        const error = new Error("유효하지 않은 Refresh Token입니다.");
        error.statusCode = 403;
        throw error;
      }

      // 새로운 Access Token, Refresh Token 생성
      const { newAccessToken, newRefreshToken } = generateTokens(user.id);

      const hashedNewRefreshToken = await hashing(newRefreshToken);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedNewRefreshToken },
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const error = new Error(
          "Refresh Token이 만료되었습니다. 다시 로그인해주세요."
        );
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
