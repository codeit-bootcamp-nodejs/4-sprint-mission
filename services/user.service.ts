import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma.js"
import bcrypt from "bcrypt";
import { HttpError } from "../middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
import type { User } from "@prisma/client"
import type { Product } from "@prisma/client";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("❌ JWT_SECRET 또는 REFRESH_SECRET 환경변수가 설정되지 않았습니다.");
}

// 회원가입
export async function signupService(email: string, nickname: string, password: string): Promise<{
  id: number;
  email: string;
  nickname: string;
  createdAt: Date;
}> {
  // 유효성 검사
  if (!email || !nickname || !password) {
    throw new HttpError("이메일과 닉네임과 패스워드는 필수입니다.", 404);
  }

  // 중복 이메일//닉네임 검사
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (existingUser) {
    throw new HttpError("이미 존재하는 이메일 또는 닉네임 입니다.", 409);
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
export async function loginService(email: string, password: string): Promise<{
  safeuser: Omit<User, "password" | "refreshToken">;
  accessToken: string;
  refreshToken: string;
  saveRefreshToken: User;
}> {
  // 유효성 검사
  if (!email || !password) {
    throw new HttpError("이메일과 비밀번호는 필수입니다.", 400);
  }

  // 이메일로 유저 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError("존재하지 않는 이메일입니다.", 404);
  }

  // 비밀번호 검증
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) {
    throw new HttpError("비밀번호가 일치하지 않습니다.", 401);
  }

  // 응답 전 비밀번호 제거
  const { password: hashedPassword, refreshToken: oldRefreshToken, ...safeuser } = user;

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
  const saveRefreshToken = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { safeuser, accessToken, refreshToken , saveRefreshToken };
}

// Google OAuth 로그인/회원가입
export async function googleOAuthService(googleProfile: {
  id: string;
  emails: Array<{ value: string; verified?: boolean }>;
  displayName: string;
  photos?: Array<{ value: string }>;
}): Promise<{
  safeuser: Omit<User, "password" | "refreshToken">;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}> {
  const email = googleProfile.emails?.[0]?.value;
  if (!email) {
    throw new HttpError("Google 계정에서 이메일을 가져올 수 없습니다.", 400);
  }

  const nickname = googleProfile.displayName || email.split("@")[0];
  const image = googleProfile.photos?.[0]?.value || null;
  const googleId = googleProfile.id;

  // 기존 사용자 찾기 (이메일로)
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // 기존 사용자 - 로그인 처리
    const { password: hashedPassword, refreshToken: oldRefreshToken, ...safeuser } = user;

    // 토큰 발급
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Refresh Token 저장
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { safeuser, accessToken, refreshToken, isNewUser: false };
  } else {
    // 새 사용자 - 회원가입 처리
    // Google OAuth 사용자는 비밀번호가 없으므로 랜덤 비밀번호 생성 (실제로는 사용되지 않음)
    const randomPassword = await bcrypt.hash(googleId + Date.now(), 10);
    
    // 닉네임이 중복될 수 있으므로 처리
    let finalNickname = nickname ?? `user_${Date.now()}`;
    let nicknameExists;

    if (finalNickname) {
    nicknameExists = await prisma.user.findUnique({ where: { nickname: finalNickname } }) };
    let counter = 1;
    while (nicknameExists) {
      finalNickname = `${nickname}${counter}`;
      nicknameExists = await prisma.user.findUnique({ where: { nickname: finalNickname } });
      counter++;
    }
    const validNickname = finalNickname ?? `user_${Date.now()}`;

    const newUser = await prisma.user.create({
      data: {
        email,
        nickname: validNickname,
        password: randomPassword,
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

    // 토큰 발급
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Refresh Token 저장
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    return { safeuser: newUser, accessToken, refreshToken, isNewUser: true };
  }
}


// 내 정보 조회
export async function inquiryService(userId: number): Promise<{
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}> {
  if (!userId) {
    throw new HttpError("사용자를 찾을 수 없습니다.", 404);
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
    throw new HttpError("유저를 찾을 수 없습니다.", 404);
  }

  // 성공하면 조회된 사용자 객체 반환
  return inquiryUser;
}


// 내 정보 수정
type EditUserData = {
    password: string;
    nickname: string;
    email: string;
    image: string | null ;
};

export async function editUserService(userId: number, data: EditUserData ): Promise<{
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}> {
  const { password, nickname, email, image } = data;

  if (!password) {
    throw new HttpError("비밀번호는 필수입니다.", 400);
  }

  // DB에서 내 유저 정보 찾기 (비밀번호 일치하는지 확인용)
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  
  if (!user) {
    throw new HttpError("유저를 찾을 수 없습니다.", 404);
  }

  // 비밀번호 일치하는지 확인
  const correctpassword = await bcrypt.compare(password, user.password);
  if (!correctpassword) {
    throw new HttpError("비밀번호가 일치하지 않습니다.", 400);
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
export async function editPasswordService(userId: number,  currentPassword: string, newPassword: string ): Promise<User> {
  if (!currentPassword || !newPassword) {
    throw new HttpError("현재 비밀번호와 새 비밀번호 모두 입력하세요.", 400);
  }

  // DB에서 내 유저 정보 찾기
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new HttpError("유저를 찾을 수 없습니다.", 404);
  }

  // 현재 비밀번호와 비교
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new HttpError("현재 비밀번호가 일치하지 않습니다.", 401);
  }

  // 새 비밀번호 비교
  const isSameOld = await bcrypt.compare(newPassword, user.password);
  if (isSameOld) {
    throw new HttpError("새 비밀번호는 현재 비밀번호와 달라야 합니다", 400);
  }

  // 새 비밀번호 해싱
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS!, 10) || 10;
  const hashedNew = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // DB에 비밀번호 업데이트
  const updatedPassword = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNew },
  });

  return updatedPassword;
}


// Refresh Token을 이용해 Access Token 재발급
export async function refreshService(refreshToken: string): Promise<string>  {
  if (!refreshToken) {
    throw new HttpError("리프레쉬 토큰이 필요합니다.", 401);
  }

  // DB에 저장된 Refresh Token과 일치하는지 확인
  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    throw new HttpError("유효하지 않은 리프레쉬 토큰입니다.", 403);
  }

  // Refresh Token 검증
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    throw new HttpError("리프레쉬 토큰이 만료되었거나 유효하지 않습니다.", 403);
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
export async function listupService(userId: number): Promise<{
  id: number;
  title: string;
  content: string;
  price: number;
  image: string | null;
  tags: string[];
  createdAt: Date;
}[]> {
  // 해당 유저가 등록한 상품 목록 가져오기
  const listup = await prisma.product.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      image: true,
      tags: true,
      createdAt: true,
    },
  });

  if (!listup || listup.length === 0) {
    throw new HttpError("등록한 상품이 없습니다.", 404);
    };

  return listup;
};
