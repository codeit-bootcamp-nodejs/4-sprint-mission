import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const prisma = new PrismaClient();

export class AuthController {
  // 로그인
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "존재하지 않는 이메일" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "비밀번호 불일치" });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // DB에 refresh token 저장
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.json({ accessToken, refreshToken });
    } catch (err) {
      res.status(500).json({ error: "로그인 실패" });
    }
  }

  // 토큰 갱신
  async refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh Token 필요" });

    try {
      const payload = verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ error: "Refresh Token 불일치" });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // 새로운 refresh token 갱신
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(403).json({ error: "Refresh Token 검증 실패" });
    }
  }

  // 로그아웃
  async logout(req, res) {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });
      res.json({ message: "로그아웃 완료" });
    } catch (err) {
      res.status(500).json({ error: "로그아웃 실패" });
    }
  }
}
