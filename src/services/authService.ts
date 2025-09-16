import prisma from "../lib/prisma.js";
import { hashPassword } from "../lib/hash.js";
import type {
  CheckUserExistsInput,
  CheckUserExistsResult,
  CreateUserInput,
  CreateUserResult,
} from "../types/service/auth.service.types.js";

/** 이메일 또는 닉네임 중복 확인 */
export const checkUserExists = async ({
  email,
  nickname,
}: CheckUserExistsInput): Promise<CheckUserExistsResult> => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
};

/** 사용자 생성 */
export const createUser = async ({
  email,
  nickname,
  password,
}: CreateUserInput): Promise<CreateUserResult> => {
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
      provider: "local",
      providerId: email,
    },
  });
};
