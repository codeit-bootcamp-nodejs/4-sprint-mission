import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';


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
    const error = new Error('이미 해당 이메일/ 닉네임을 사용하는 사용자가 있습니다.');
    throw error;
  }

  const createUser = await prisma.user.create({
    data: { email, password: hashedPassword, nickname },
  });

  const { password: _, ...userWithoutPassword } = createUser;
  return userWithoutPassword;
}

//비밀번호 검증
async function verifyPassword(inputPassword, savedPassword){
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if(!isValid){
    const error = new Error('잘못된 비밀번호입니다.');
    error.code = 401;
    throw error;
  }
}

//로그인
async function login(email, password){
  const user = await prisma.user.findUnique({ where: { email }});
  if(!user){
    const error = new Error('해당 사용자를 찾을 수 없습니다.');
    error.code = 404;
    throw error;
  }
  await verifyPassword(password, user.password)
  
  const {password:_, ...withtoutPassword} = user;
  return withtoutPassword;
}

//리프레쉬 토큰 DB 저장 
async function updateRefreshToken(userId, refreshToken) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
  return updatedUser;
}

export default {
  register, 
  login,
  updateRefreshToken,

};