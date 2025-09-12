import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../lib/token.js";

export const registerUser = async (email, nickname, password) => {
  try {
    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (checkUser) {
      const error = new Error("이미 가입된 이메일입니다.");
      error.statusCode = 409;
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (user) => {
  try {
    const { accessToken, refreshToken } = generateTokens(user.id);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export const refreshAccessToken = async (user) => {
  try {
    const { accessToken, refreshToken } = generateTokens(user.id);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
