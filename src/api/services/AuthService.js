import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const AuthService = {
  async signup(signupData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });

    if (existingUser) {
      const error = new Error("이미 가입된 이메일입니다.");
      error.statusCode = 409;
      throw error;
    }

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: signupData,
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

    // 토큰 생성
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 로그인 시 RefreshToken 생성
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { password: _, ...userWithoutPassword } = user;
    // 테스트를 위해 refreshToken 출력
    return { userWithoutPassword, accessToken, refreshToken };
  },

  async refreshAccessToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      const error = new Error("Refresh Token이 제공되지 않았습니다.");
      error.statusCode = 401;
      throw error;
    }

    try {
      const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.refreshToken !== oldRefreshToken) {
        const error = new Error("유효하지 않은 Refresh Token입니다.");
        error.statusCode = 403;
        throw error;
      }

      // 새로운 Access Token 생성
      const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // prettier-ignore
      const newRefreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      })

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
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
