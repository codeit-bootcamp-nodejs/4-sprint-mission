import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/token.js";
import { findUserByEmail, createUser } from "../repositories/authRepository.js";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (
  email: string,
  nickname: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error: HttpError = new Error("이미 가입된 이메일입니다.");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, nickname, hashedPassword);

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
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
