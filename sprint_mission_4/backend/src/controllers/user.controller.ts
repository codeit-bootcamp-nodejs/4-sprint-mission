import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
  };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      res.status(400).json({ message: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env['JWT_SECRET']!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env['JWT_REFRESH_SECRET']!,
      { expiresIn: '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: '리프레시 토큰이 제공되지 않았습니다.' });
      return;
    }

    const decoded = jwt.verify(refreshToken, process.env['JWT_REFRESH_SECRET']!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
      return;
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env['JWT_SECRET']!,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nickname, image } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(nickname && { nickname }),
        ...(image && { image })
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 입력해주세요.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getMyProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getMyLikedProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const likedProducts = await prisma.like.findMany({
      where: { 
        userId: req.user!.id,
        productId: { not: null }
      },
      include: {
        product: {
          include: {
            _count: {
              select: { comments: true, likes: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const products = likedProducts.map(like => like.product);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};