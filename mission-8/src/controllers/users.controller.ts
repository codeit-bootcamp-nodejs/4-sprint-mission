import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users.service.js";
import { SignUpDto, SignInDto, UpdateUserDto, UpdatePasswordDto } from "../dtos/user.dto.js"; // Import DTOs
// getMyProducts, getLikedProducts는 아직 리팩토링 전이라 prisma가 필요합니다.
import { prisma } from "../utils/prisma.util.js";

export class UsersController {
  usersService = new UsersService();

  // 회원가입
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signUpDto: SignUpDto = req.body; // Use DTO

      if (!signUpDto.email || !signUpDto.password || !signUpDto.confirmPassword || !signUpDto.nickname) {
        return res.status(400).json({ message: "모든 필드 입력해주세요." });
      }
      if (signUpDto.password.length < 6) {
        return res.status(400).json({ message: "비밀번호는 6자리 이상이어야 합니다." });
      }
      if (signUpDto.password !== signUpDto.confirmPassword) {
        return res.status(400).json({ message: "비밀번호를 확인해주세요" });
      }

      const newUser = await this.usersService.signUp(signUpDto); // Pass DTO
      return res.status(201).json({ data: newUser });
    } catch (err: any) {
      if (err.name === "ConflictError") {
        return res.status(409).json({ message: err.message });
      }
      next(err);
    }
  };

  // 로그인
  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInDto: SignInDto = req.body; // Use DTO
      if (!signInDto.email || !signInDto.password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
      }
      const tokens = await this.usersService.signIn(signInDto); // Pass DTO
      return res.status(200).json({ data: tokens });
    } catch (err: any) {
      if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: err.message });
      }
       if (err.name === "ServerError") {
        return res.status(500).json({ message: err.message });
      }
      next(err);
    }
  };

  // 내 정보 조회
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
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
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const updateUserDto: UpdateUserDto = req.body; // Use DTO
      if (!updateUserDto.nickname && !updateUserDto.image) {
        return res.status(400).json({ message: "수정할 정보를 입력해주세요." });
      }
      const updatedUser = await this.usersService.updateMe(user.id, updateUserDto); // Pass DTO
      return res.status(200).json({ data: updatedUser });
    } catch (err: any) {
      if (err.name === "ConflictError") {
        return res.status(409).json({ message: err.message });
      }
      next(err);
    }
  };

  // 비밀번호 변경
  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const updatePasswordDto: UpdatePasswordDto = req.body; // Use DTO
      if (!updatePasswordDto.currentPassword || !updatePasswordDto.newPassword || !updatePasswordDto.confirmNewPassword) {
        return res.status(400).json({ message: "모든 필드 입력해주세요" });
      }
      if (updatePasswordDto.newPassword.length < 6) {
        return res.status(400).json({ message: "새로운 비밀번호는 6자 이상 작성해야합니다." });
      }
      if (updatePasswordDto.newPassword !== updatePasswordDto.confirmNewPassword) {
        return res.status(400).json({ message: "새로운 비밀번호 일치하지 않습니다." });
      }
      await this.usersService.updatePassword(user.id, updatePasswordDto); // Pass DTO
      return res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: err.message });
      }
      if (err.name === "BadRequestError") {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  };

  // Access Token 재발급
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ message: "Refresh Token이 필요합니다." });
      }
      const [tokenType, token] = authorization.split(" ");
      if (tokenType !== "Bearer" || !token) {
        return res.status(401).json({ message: "지원하지 않는 토큰 형식입니다." });
      }
      const result = await this.usersService.refreshToken(token);
      return res.status(200).json({ accessToken: result.accessToken });
    } catch (err: any) {
      if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: err.message });
      }
       if (err.name === "ServerError") {
        return res.status(500).json({ message: err.message });
      }
      next(err);
    }
  };

  // 프로필 이미지 업로드
  updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "이미지 파일 업로드해주세요" });
      }
      const updatedUser = await this.usersService.updateProfileImage(user.id, file.path);
      return res.status(200).json({
        message: "프로필 이미지가 성공적으로 변경되었습니다.",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  };

  // --- Products-related methods to be refactored later ---
  // 특정 유저가 등록한 상품 목록 조회
  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const products = await prisma.product.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  // 내가 '좋아요' 누른 상품 목록 조회
  getLikedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
      }
      const likedProducts = await prisma.product.findMany({
        where: { likes: { some: { userId: user.id } } },
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { nickname: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ data: likedProducts });
    } catch (err) {
      next(err);
    }
  };
}
