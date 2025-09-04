import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../lib/token.js';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

import AppError from '../lib/appError.js';

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
    console.log('생성된 엑세스 토큰:', accessToken);
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

  // async updatePassword(userId, currentPassword, newPassword) {
  //   const user = await prisma.user.findUnique({ where: { id: userId } });
  //   const isValid = await bcrypt.compare(currentPassword, user.password);
  //   if (!isValid) throw new Error('현재 비밀번호가 일치하지 않습니다.');

  //   const hashed = await bcrypt.hash(newPassword, 10);
  //   return prisma.user.update({
  //     where: { id: userId },
  //     data: { password: hashed },
  //   });
  // }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log('입력한 currentPassword:', currentPassword);
    console.log('DB에 저장된 user.password (해시):', user.password);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    console.log('bcrypt.compare 결과:', isValid);

    if (!isValid) throw new AppError('현재 비밀번호가 일치하지 않습니다.');

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld)
      throw new AppError('기존 비밀번호로는 변경할 수 없습니다.');

    const hashed = await bcrypt.hash(newPassword, 10);
    console.log('새 비밀번호 해시:', hashed);

    return prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
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
