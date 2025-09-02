import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

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
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user, token };
  },
};

export default AuthService;
