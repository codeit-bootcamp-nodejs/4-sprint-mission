// src/services/authService.ts
import * as authRepository from '../repositories/authRepository';
import { UserRegister, UserLogin, UserUpdate, PasswordChange } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (data: UserRegister) => {
  const { email, nickname, password } = data;

  if (!email || !nickname || !password) {
    throw new Error('모든 필드를 입력해주세요.');
  }

  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('이미 사용 중인 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    nickname,
    password: hashedPassword
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (data: UserLogin) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.');
  }

  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );

  await authRepository.deleteRefreshTokensByUserId(user.id);

  await authRepository.createRefreshToken(refreshToken, user.id);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error('리프레시 토큰이 필요합니다.');
    }

    const savedToken = await authRepository.findRefreshTokenByToken(refreshToken);
    if (!savedToken || !savedToken.user || !savedToken.user.id || !savedToken.user.email) {
        throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

        const accessToken = jwt.sign(
            { id: savedToken.user.id, email: savedToken.user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return { accessToken };
    } catch (error) {
        await authRepository.deleteRefreshToken(refreshToken);
        throw new Error('만료되었거나 유효하지 않은 리프레시 토큰입니다.');
    }
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 필요합니다.');
  }

  await authRepository.deleteRefreshToken(refreshToken);
};

export const getMyInfo = async (userId: number) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return user;
};

export const updateMyInfo = async (userId: number, data: UserUpdate) => {
  const { nickname, image } = data;

  if (!nickname && image === undefined) {
    throw new Error('업데이트할 정보가 필요합니다.');
  }

  const existingUser = await authRepository.findUserById(userId);
  if (!existingUser) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return authRepository.updateUser(userId, {
    ...(nickname && { nickname }),
    ...(image !== undefined && { image })
  });
};

export const changePassword = async (userId: number, data: PasswordChange) => {
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
        throw new Error('현재 비밀번호와 새 비밀번호가 필요합니다.');
    }

    if (currentPassword === newPassword) {
        throw new Error('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
    }

    const user = await authRepository.findUserWithPasswordById(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('현재 비밀번호가 올바-르지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return authRepository.updateUserPassword(userId, hashedPassword);
};