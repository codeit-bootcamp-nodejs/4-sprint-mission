import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

import { appConfig } from '../../config/app.config.js';
import { MESSAGE, STATUS_CODE } from '../../constants/constant.js';
import { HttpException } from '../../utils/http-exception.js';
import logger from '../../utils/logger.js';
import { authRepository } from './auth.repository.js';
import type { registerInputData } from './auth.type.js';

export const authRegisterService = async (registerData: registerInputData) => {
  let user;
  const saltRounds = appConfig.bcryptSaltRounds;
  const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);
  const dataToCreate = {
    ...registerData,
    password: hashedPassword,
  };
  try {
    user = await authRepository.register(dataToCreate);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = err.meta?.['target'];

      if (Array.isArray(target) && target.length > 0) {
        const targetField = target[0];

        if (targetField === 'email') {
          throw new HttpException(
            STATUS_CODE.CONFLICT,
            `이메일 '${dataToCreate.email}'을(를) 이미 누군가 사용 중입니다.`,
          );
        }

        if (targetField === 'username') {
          throw new HttpException(
            STATUS_CODE.CONFLICT,
            `닉네임 '${dataToCreate.username}'을(를) 이미 누군가 사용 중입니다.`,
          );
        }
      }
    }
    logger.error({ message: '회원가입 서비스 에러', error: err });
    throw new HttpException(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.serverError);
  }

  const result = { id: user.id, username: user.username, email: user.email };
  return result;
};
