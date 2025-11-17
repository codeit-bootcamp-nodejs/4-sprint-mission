//src/controllers/auth_controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, nickname, password } = req.body;

      if (!email || !nickname || !password) {
        return res.status(400).json({ error: '필수 필드를 입력해주세요.' });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: '이미 존재하는 이메일입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, nickname, password: hashedPassword },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: { id: user.id, email: user.email, nickname: user.nickname },
        token,
      });
    } catch (error) {
      console.error('회원가입 오류:', error);
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        user: { id: user.id, email: user.email, nickname: user.nickname },
        token,
      });
    } catch (error) {
      console.error('로그인 오류:', error);
      res.status(500).json({ error: '로그인에 실패했습니다.' });
    }
  }
}

export default new AuthController();