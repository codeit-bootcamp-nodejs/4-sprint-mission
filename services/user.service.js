import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("❌ JWT_SECRET 또는 REFRESH_SECRET 환경변수가 설정되지 않았습니다.");
}

// 회원가입
export async function signupService(email, nickname, password) {
  // 유효성 검사
  if (!email || !nickname || !password) {
    const error = new Error("이메일과 닉네임과 패스워드는 필수입니다.");
    error.status = 404;
    throw error;
  }

  // 중복 이메일//닉네임 검사
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (existingUser) {
      const error = new Error("이미 존재하는 이메일 또는 닉네임 입니다.");
      error.status = 409;
      throw error;
  }

  //비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB에 유저 저장
  const newUser = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      createdAt: true,
    },
  });

  return newUser;
}


// 로그인
export async function loginService(email, password) {
  // 유효성 검사
  if (!email || !password) {
    const error = new Error("이메일과 비밀번호는 필수입니다.")
    error.status = 400;
    throw error;
  }

  // 이메일로 유저 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("존재하지 않는 이메일입니다.")
    error.status = 404;
    throw error;
  }

  // 비밀번호 검증
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) {
    const error = new Error("비밀번호가 일치하지 않습니다.")
    error.status = 401;
    throw error;
  }

  // 응답 전 비밀번호 제거
  const { password: hashedPassword, ...safeuser } = user;

  // 토큰 기반 인증: 로그인에 성공하면 Access Token 발급하는 기능
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email }, //payload
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Refresh Token 발급
  const refreshToken = jwt.sign(
    { userId: user.id}, 
    REFRESH_SECRET, 
    { expiresIn: "7d" }
  );

  // DB에 Refresh Token 저장
  const saveRfreshToken = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { safeuser, accessToken, refreshToken , saveRfreshToken};
}


// 내 정보 조회
export async function inquiryService(userId) {
  if (!userId) {
    const error = new Error("사용자를 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  }

  // 토큰에서 정보 찾아서 셀렉
  const inquiryUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!inquiryUser) {
    const error = new Error("유저를 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  }

  // 성공하면 조회된 사용자 객체 반환
  return inquiryUser;
}


// 내 정보 수정
export async function editUserService(userId, data = {} ) {
  const { password, nickname, email, image} = data;
  if (!password) {
    const error = new Error("비밀번호는 필수입니다.");
    error.status = 400;
    throw error;
  }

  // DB에서 내 유저 정보 찾기 (비밀번호 일치하는지 확인용)
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  
  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.")
    error.status = 404;
    throw error;
  }

  // 비밀번호 일치하는지 확인
  const correctpassword = await bcrypt.compare(password, user.password);
  if (!correctpassword) {
    const error = new Error("비밀번호가 일치하지 않습니다.")
    error.status = 400;
    throw error;
  }

  // 정보 수정 과정
  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      nickname,
      email,
      image,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}


// 내 비밀번호 수정
export async function editPasswordService(userId, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    const error = new Error("현재 비밀번호와 새 비밀번호 모두 입력하세요.");
    error.status = 400;
    throw error;
  }

  // DB에서 내 유저 정보 찾기
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user) {
    const error = new Error(" 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 현재 비밀번호와 비교
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("현재 비밀번호가 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }

  // 새 비밀번호 비교
  const isSameOld = await bcrypt.compare(newPassword, user.password);
  if (isSameOld) {
    const error = new Error("새 비밀번호는 현재 비밀번호와 달라야 합니다");
    error.status = 400;
    throw error;
  }

  // 새 비밀번호 해싱
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
  const hashedNew = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // DB에 비밀번호 업데이트
  const updatedPassword = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNew },
  });

  return updatedPassword;
}


// Refresh Token을 이용해 Access Token 재발급
export async function refreshService(refreshToken) {
  if (!refreshToken) {
    const error = new Error("리프레쉬 토큰이 필요합니다.");
    error.status = 401;
    throw error;
  }

  // DB에 저장된 Refresh Token과 일치하는지 확인
  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    const error = new Error("유효하지 않은 리프레쉬 토큰입니다.");
    error.status = 403;
    throw error;
  }

  // Refresh Token 검증
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    const error = new Error("리프레쉬 토큰이 만료되었거나 유효하지 않습니다.");
    error.status = 403;
    throw error;
  }

  // 새로운 Access Token 발급
  const newAccessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return newAccessToken;
}


// 등록한 상품의 목록 조회 기능
export async function listupService(userId) {
  // 해당 유저가 등록한 상품 목록 가져오기
  const listup = await prisma.product.findMany({
    where: { userId: userId },
    select: {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    },
  });

  if (!listup || listup.length === 0) {
    const error = new Error("등록한 상품이 없습니다.");
    error.status = 404;
    throw error;
    };

  return listup;
};

  

