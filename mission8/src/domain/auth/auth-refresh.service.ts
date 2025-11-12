import jwt from 'jsonwebtoken';

import { authConfig } from '../../config/auth.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/exception.js';
import prisma from '../../utils/prisma.js';

export const authRefreshService = async (userId: number, refreshToken: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { refreshToken: true },
  });

  if (!user || !user.refreshToken) {
    throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.refreshTokenNotFound);
  }

  if (user.refreshToken.token !== refreshToken) {
    throw new HttpException(STATUS_CODE.NOT_FOUND, MESSAGE.refreshTokenNotFound);
  }

  const newAccessToken = jwt.sign({ userId: user.id }, authConfig.accessTokenSecretKey, {
    expiresIn: authConfig.accessTokenExpiresIn as any,
  });
  return newAccessToken;
};
