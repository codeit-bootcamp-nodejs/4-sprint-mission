import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../lib/token.js';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

class UserService {
  async register(username, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userCheck = await prisma.user.findUnique({
      where: { username },
    });
    if (userCheck) {
      return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
    }
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(userId) {
    const { accessToken, refreshToken } = generateTokens(userId);
    console.log('Generated accessToken:', accessToken);
    return { accessToken, refreshToken };
  }

  async getUserProfile(userId) {
    const getUserProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        images: true,
      },
    });
    return getUserProfile;
  }

  async updateUserProfile(userId, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updateUserProfile = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        username: true,
        email: true,
        images: true,
      },
    });
    return updateUserProfile;
  }

  setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/refresh',
    });
  }

  clearTokenCookies(res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }
}

export const userService = new UserService();
