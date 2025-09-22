import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export class AuthController {
  // 로그인
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ error: "존재하지 않는 이메일" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "비밀번호 불일치" });
        return;
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

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
  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh Token 필요" });
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken) as { id: number };

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user || user.refreshToken !== refreshToken) {
        res.status(403).json({ error: "Refresh Token 불일치" });
        return;
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch {
      res.status(403).json({ error: "Refresh Token 검증 실패" });
    }
  }

  // 로그아웃
  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "인증 필요" });
        return;
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });

      res.json({ message: "로그아웃 완료" });
    } catch {
      res.status(500).json({ error: "로그아웃 실패" });
    }
  }
}
