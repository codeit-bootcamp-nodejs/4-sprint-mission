import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { generateTokens } from './token.js'


//회원가입
async function register(email, password, nickname) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { nickname },
      ],
    },
  });

  if (existedUser) {
    const error = new Error('A user with this email or nickname already exists');
    throw error;
  }
  const createUser = await prisma.user.create({
    data: { email, password: hashedPassword, nickname },
  });
  const { password: _, ...userWithoutPassword } = createUser;
  return userWithoutPassword;
}

// 로그인 -> 토큰 만들거 리프레쉬 토큰 디비에 저장
async function login(user) {
  const { accessToken, refreshToken } = generateTokens(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  
  return { accessToken, refreshToken };
}

async function reissueTokens(userId, oldRefreshToken){
  const user = await prisma.user.findFirst({ where : { id: userId }});
  if( !user || user.refreshToken !== oldRefreshToken){
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  } else {
    const { accessToken, refreshToken } = generateTokens(userId);
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
    return { accessToken, refreshToken };
  }
}

export default {
  register, 
  login,
  reissueTokens
};