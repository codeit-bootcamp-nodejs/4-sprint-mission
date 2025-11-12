import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/exception.js';
import logger from '../../utils/logger.js';
import { authRepository } from './auth.repository.js';

export const authLoginService = async (email: string, password: string) => {
  try {
    const user = await authRepository.find(email);
    if (!user) {
      throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.invalidCredentials);
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new HttpException(STATUS_CODE.UNAUTHORIZED, MESSAGE.invalidCredentials);
    }

    const accessToken = jwt.sign({ userId: user.id }, authConfig.accessTokenSecretKey, {
      expiresIn: authConfig.accessTokenExpiresIn as any,
    });

    const refreshToken = jwt.sign({ userId: user.id }, authConfig.refreshTokenSecretKey, {
      expiresIn: authConfig.refreshTokenExpiresIn as any,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(authConfig.refreshTokenExpiresIn));
    const userId = user.id;

    authRepository.createRefreshToken(refreshToken, userId, expiresAt);

    const result = {
      accessToken,
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return result;
  } catch (err) {
    logger.debug({
      message: 'auth login error',
      err: err,
    });
    throw new HttpException(STATUS_CODE.SERVER_ERROR, MESSAGE.serverError);
  }
};
