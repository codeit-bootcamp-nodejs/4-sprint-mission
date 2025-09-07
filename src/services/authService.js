import prisma from "../lib/prisma.js";
import { hashPassword } from "../lib/hash.js";

/** 이메일 또는 닉네임 중복 확인 */
export async function checkUserExists({ email, nickname }) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
}

/** 사용자 생성 */
export async function createUser({ email, nickname, password }) {
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
}
