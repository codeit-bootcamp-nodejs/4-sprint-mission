import { Request, Response, NextFunction } from 'express';
import UserService from '../UserService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../index';
import {
  UserCreateDto,
  UserSignInDto,
  UserUpdateDto,
  UserChangePasswordDto,
} from '../dtos/UserDto';

class UsersController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickname, password }: UserCreateDto = req.body;

      if (!email || !nickname || !password) {
        return res.status(400).json({ message: '모든 정보를 입력해주세요' });
      }

      const newUser = await this.userService.signUp({ email, nickname, password });

      return res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        data: newUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: UserSignInDto = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
      }
      const { accessToken, refreshToken } = await this.userService.signIn(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        message: '로그인에 성공했습니다.',
        data: { accessToken },
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      res.status(200).json({
        message: '내 정보 조회 성공',
        data: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, image }: UserUpdateDto = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      if (!nickname && !image) {
        return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
      }

      const updatedData: { nickname?: string; image?: string } = {
        ...(nickname && { nickname }),
        ...(image && { image }),
      };

      const updatedUser = await this.userService.updateUser(user.id, updatedData);

      res.status(200).json({
        message: '내 정보 수정에 성공했습니다.',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          nickname: updatedUser.nickname,
          image: updatedUser.image,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword }: UserChangePasswordDto = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: '모든 정보를 입력해주세요.' });
      }
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
      }

      const existingUser = await this.userService.getUserById(user.id);
      if (!existingUser) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const isPasswordMatched = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isPasswordMatched) {
        return res.status(401).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.userService.updatePassword(user.id, hashedNewPassword);

      res.status(200).json({ message: '비밀번호 변경이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const products = await this.userService.getProductsByUserId(user.id);

      res.status(200).json({
        message: '내가 작성한 상품 목록 조회에 성공했습니다.',
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token이 없습니다.' });
      }

      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY as string,
      ) as { userId: number };
      const userId = decodedToken.userId;

      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      const isRefreshTokenMatched = await bcrypt.compare(refreshToken, user.refreshToken as string);
      if (!isRefreshTokenMatched) {
        return res.status(401).json({ message: 'Refresh Token이 유효하지 않습니다.' });
      }

      const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '12h',
      });

      return res.status(200).json({
        message: 'Access Token이 재발급되었습니다.',
        data: { accessToken: newAccessToken },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
          return res
            .status(401)
            .json({
              message: 'Refresh Token이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요 ',
            });
        }
      }
      next(error);
    }
  };
}

export default UsersController;
