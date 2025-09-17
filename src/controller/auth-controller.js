import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, hashToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

// 회원가입
export async function register(req, res) {
  try {
    const { email, nickname, password, image } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ message: "email, nickname, password는 필수입니다." });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
        image: image ?? null,
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 로그인: 액세스 + 리프레시 동시 발급
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "이메일과 비밀번호는 필수입니다." });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 리프레시 토큰 저장 (해시로)
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(jwt.decode(refreshToken).exp * 1000),
      },
    });

    return res.status(200).json({
      message: "로그인 성공",
      accessToken,
      refreshToken, // 데모에서는 body로 반환. 운영에서는 HttpOnly 쿠키 권장.
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 토큰 갱신: 리프레시로 새 액세스/리프레시 발급 + 로테이션
export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken이 필요합니다." });

    // 1) 검증
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "유효하지 않은 리프레시 토큰입니다." });
    }

    // 2) DB 확인 (해시 매칭, 만료/철회 여부)
    const tokenRow = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.id,
        tokenHash: hashToken(refreshToken),
        isRevoked: false,
      },
    });
    if (!tokenRow) {
      return res.status(401).json({ message: "리프레시 토큰이 유효하지 않습니다." });
    }
    if (new Date() > tokenRow.expiresAt) {
      return res.status(401).json({ message: "리프레시 토큰이 만료되었습니다." });
    }

    // 3) 토큰 로테이션: 기존 철회 + 새 토큰 발급/저장
    await prisma.refreshToken.update({
      where: { id: tokenRow.id },
      data: { isRevoked: true },
    });

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefresh),
        expiresAt: new Date(jwt.decode(newRefresh).exp * 1000),
      },
    });

    return res.status(200).json({
      message: "토큰 갱신 성공",
      accessToken: newAccess,
      refreshToken: newRefresh,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}

// 로그아웃: 현재 리프레시 토큰 철회(선택) 또는 전체 철회(옵션)
export async function logout(req, res) {
  try {
    const { refreshToken, allDevices } = req.body;

    if (allDevices) {
      // 모든 기기 로그아웃
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "인증이 필요합니다." });

      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
      return res.status(200).json({ message: "모든 기기에서 로그아웃 되었습니다." });
    }

    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken이 필요합니다." });

    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), isRevoked: false },
      data: { isRevoked: true },
    });

    return res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러 발생" });
  }
}
