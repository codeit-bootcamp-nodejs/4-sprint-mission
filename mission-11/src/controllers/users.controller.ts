import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsRepository } from '../repositories/products.repository.js';
import {
  SignUpDto,
  SignInDto,
  UpdateUserDto,
  UpdatePasswordDto,
} from '../dtos/user.dto.js';
import { BadRequestError, UnauthorizedError } from '../errors/http-error.js';

export class UsersController {
  usersService: UsersService;
  productsService: ProductsService;

  constructor() {
    this.usersService = new UsersService();
    const productsRepository = new ProductsRepository();
    this.productsService = new ProductsService(productsRepository);
  }

  // 회원가입
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signUpDto: SignUpDto = req.body;

      if (
        !signUpDto.email ||
        !signUpDto.password ||
        !signUpDto.confirmPassword ||
        !signUpDto.nickname
      ) {
        throw new BadRequestError('모든 필드 입력해주세요.');
      }
      if (signUpDto.password.length < 6) {
        throw new BadRequestError('비밀번호는 6자리 이상이어야 합니다.');
      }
      if (signUpDto.password !== signUpDto.confirmPassword) {
        throw new BadRequestError('비밀번호를 확인해주세요');
      }

      const newUser = await this.usersService.signUp(signUpDto);
      return res.status(201).json({ data: newUser });
    } catch (err) {
      next(err);
    }
  };

  // 로그인
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInDto: SignInDto = req.body;
      if (!signInDto.email || !signInDto.password) {
        throw new BadRequestError('이메일과 비밀번호를 모두 입력해주세요.');
      }
      const tokens = await this.usersService.signIn(signInDto);
      return res.status(200).json({ data: tokens });
    } catch (err) {
      next(err);
    }
  };

  // 내 정보 조회
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  };

  // 유저 정보 수정
  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const updateUserDto: UpdateUserDto = req.body;
      if (!updateUserDto.nickname && !updateUserDto.image) {
        throw new BadRequestError('수정할 정보를 입력해주세요.');
      }
      const updatedUser = await this.usersService.updateMe(
        user.id,
        updateUserDto,
      );
      return res.status(200).json({ data: updatedUser });
    } catch (err) {
      next(err);
    }
  };

  // 비밀번호 변경
  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const updatePasswordDto: UpdatePasswordDto = req.body;
      if (
        !updatePasswordDto.currentPassword ||
        !updatePasswordDto.newPassword ||
        !updatePasswordDto.confirmNewPassword
      ) {
        throw new BadRequestError('모든 필드 입력해주세요');
      }
      if (updatePasswordDto.newPassword.length < 6) {
        throw new BadRequestError('새로운 비밀번호는 6자 이상 작성해야합니다.');
      }
      if (
        updatePasswordDto.newPassword !== updatePasswordDto.confirmNewPassword
      ) {
        throw new BadRequestError('새로운 비밀번호 일치하지 않습니다.');
      }
      await this.usersService.updatePassword(user.id, updatePasswordDto);
      return res
        .status(200)
        .json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  // Access Token 재발급
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new UnauthorizedError('Refresh Token이 필요합니다.');
      }
      const [tokenType, token] = authorization.split(' ');
      if (tokenType !== 'Bearer' || !token) {
        throw new UnauthorizedError('지원하지 않는 토큰 형식입니다.');
      }
      const result = await this.usersService.refreshToken(token);
      return res.status(200).json({ accessToken: result.accessToken });
    } catch (err) {
      next(err);
    }
  };

  // 프로필 이미지 업로드
  updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const file = req.file;
      if (!file) {
        throw new BadRequestError('이미지 파일 업로드해주세요');
      }
      const imagePath = (file as any).location || file.path;
      const updatedUser = await this.usersService.updateProfileImage(
        user.id,
        imagePath,
      );
      return res.status(200).json({
        message: '프로필 이미지가 성공적으로 변경되었습니다.',
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  };

  // 특정 유저가 등록한 상품 목록 조회
  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const products = await this.productsService.getProductsByAuthor(user.id);
      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  // 내가 '좋아요' 누른 상품 목록 조회
  getLikedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('인증 정보가 없습니다.');
      }
      const likedProducts = await this.productsService.getLikedProducts(
        user.id,
      );
      return res.status(200).json({ data: likedProducts });
    } catch (err) {
      next(err);
    }
  };
}
