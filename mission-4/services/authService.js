import { passwordHashing, validatePassword } from "../lib/bcrypt.js";
import { generateToken, verifyRefreshToken } from "../lib/jwtToken.js";
import prisma from "../lib/prisma.js";

async function signupService({ email, nickname, password }) {
  const hashedPassword = await passwordHashing(password);
  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function loginService({ email, password }) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const isPasswordValid = await validatePassword(password, user.password);
  if (!isPasswordValid) {
    const err = new Error("비밀번호가 일치하지 않습니다.");
    err.statusCode = 401;
    throw err;
  }
  const { accessToken, refreshToken } = generateToken(user.id);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });
  return { accessToken, refreshToken };
}

async function refreshService({ refreshToken }) {
  return prisma.$transaction(async (tx) => {
    // 토큰 검증, 유효성 확인, 재발급, db 업데이트를 트랜잭션으로 묶기
    const result = verifyRefreshToken(refreshToken);
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: result.id,
      },
      select: {
        email: true,
        refreshToken: true,
      },
    });
    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      const err = new Error("유효하지 않은 리프레시 토큰입니다.");
      err.statusCode = 403;
      throw err;
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user.email);
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });
    return { accessToken, refreshToken: newRefreshToken };
  });
}

export { signupService, loginService, refreshService };
