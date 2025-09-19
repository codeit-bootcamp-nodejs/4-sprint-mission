import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/token.js";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (
  email: string,
  nickname: string,
  password: string
): Promise<Express.User> => {
  try {
    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (checkUser) {
      const error: HttpError = new Error("이미 가입된 이메일입니다.");
      error.status = 409;
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (user: Express.User): Promise<Tokens> => {
  try {
    const { accessToken, refreshToken } = generateTokens(user.id);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

export const refreshAccessToken = async (
  user: Express.User
): Promise<Tokens> => {
  try {
    const { accessToken, refreshToken } = generateTokens(user.id);

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
