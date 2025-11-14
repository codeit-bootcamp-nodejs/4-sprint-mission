import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import logger from '../../utils/logger.js';
import { authRepository } from './auth.repository.js';
import type { CreateRefreshTokenInput } from './auth.type.js';

export const authLoginService = async (email: string, password: string) => {
  const user = await authRepository.find(email);
  if (!user) {
    throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.invalidCredentials);
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidCredentials);
  }

  const accessToken = jwt.sign({ userId: user.id }, authConfig.accessTokenSecretKey, {
    expiresIn: authConfig.accessTokenExpiresIn,
  });
  const refreshToken = jwt.sign({ userId: user.id }, authConfig.refreshTokenSecretKey, {
    expiresIn: authConfig.refreshTokenExpiresIn,
  });

  const decoded = jwt.decode(refreshToken) as { exp: number } | null;

  if (!decoded || !decoded.exp) {
    throw new HttpException(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.serverError);
  }

  const refreshTokenExpiresAt = new Date(decoded.exp * 1000);

  const createRefreshTokenInput: CreateRefreshTokenInput = {
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  };
  try {
    await authRepository.createRefreshToken(createRefreshTokenInput);
  } catch (err) {
    logger.error({ message: '로그인 서비스 에러', error: err, email });
    throw new HttpException(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.serverError);
  }

  const result = {
    accessToken,
    refreshToken,
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return result;
};
