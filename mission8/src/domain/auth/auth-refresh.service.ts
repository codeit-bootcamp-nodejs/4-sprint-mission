import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import { authRepository } from './auth.repository.js';

export const authRefreshService = async (userId: number, refreshToken: string) => {
  const storedToken = await authRepository.findRefreshToken(userId);

  if (!storedToken) {
    throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.refreshTokenNotFound);
  }

  if (storedToken.expiresAt < new Date()) {
    await authRepository.delete(userId);
    throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.expiredToken);
  }

  if (storedToken.token !== refreshToken) {
    throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidToken);
  }

  try {
    jwt.verify(refreshToken, authConfig.refreshTokenSecretKey);
  } catch {
    throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidToken);
  }

  const newAccessToken = jwt.sign({ userId }, authConfig.accessTokenSecretKey, {
    expiresIn: authConfig.accessTokenExpiresIn,
  });
  return newAccessToken;
};
