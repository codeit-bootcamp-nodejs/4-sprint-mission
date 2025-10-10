import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user-service';
import {
  ChangePasswordDto,
  SignInDto,
  SignUpDto,
  UpdateUserInfoDto,
} from '../types/dto';

export class UserController {
  constructor(private userService: UserService) {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signUpDto: SignUpDto = req.body;
      const newUser = await this.userService.signUp(signUpDto);
      res.status(201).json({ data: newUser });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInDto: SignInDto = req.body;
      const tokens = await this.userService.signIn(signInDto);
      res.status(200).json({
        message: '로그인에 성공했습니다.',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: '리프레시 토큰이 필요합니다.' });
      }
      const newAccessToken = await this.userService.refreshToken(refreshToken);
      res.status(200).json({
        message: '토큰이 성공적으로 재발급되었습니다.',
        data: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      await this.userService.signOut(userId);
      res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const userInfo = await this.userService.getUserInfo(userId);
      res.status(200).json({ data: userInfo });
    } catch (error) {
      next(error);
    }
  };

  updateMyInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const updateUserInfoDto: UpdateUserInfoDto = req.body;
      const updatedUser = await this.userService.updateUserInfo(
        userId,
        updateUserInfoDto,
      );
      res.status(200).json({
        message: '사용자 정보가 성공적으로 수정되었습니다.',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  changeMyPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const changePasswordDto: ChangePasswordDto = req.body;

      if (!changePasswordDto.currentPassword || !changePasswordDto.newPassword) {
        return res.status(400).json({
          message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
        });
      }

      await this.userService.changePassword(userId, changePasswordDto);
      res
        .status(200)
        .json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const products = await this.userService.getMyProducts(userId);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  getLikedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const products = await this.userService.getLikedProducts(userId);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  getLikedArticles = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const articles = await this.userService.getLikedArticles(userId);
      res.status(200).json({ data: articles });
    } catch (error) {
      next(error);
    }
  };
}