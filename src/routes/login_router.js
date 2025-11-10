import express from "express";
import bcrypt from "bcrypt";
import prisma from "../services/prisma.js";
import { generateTokens, verifyRefreshToken } from "../lib/token.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from "../lib/constants.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/refresh", refreshTokens);
router.post("/user/logout", logout);

async function register(req, res) {
  const { email, nickname, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: { email, nickname, password: hashedPassword },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: `${user.nickname}님, 어서오세요.` });
}

async function refreshTokens(req, res) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  const { userId } = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user.id
  );
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
}

async function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).json({ message: "로그아웃 성공" });
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 1 * 60 * 60 * 1000, // 1시간
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    path: "/auth/refresh",
  });
}

function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export default router;
