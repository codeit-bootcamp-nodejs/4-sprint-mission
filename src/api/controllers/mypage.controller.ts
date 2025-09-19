import MypageService from "../services/mypage/mypage.service.js";
import type { Request, Response, NextFunction } from "express";
import type { RequestWithDto } from "../types/express.d.ts";
import type { UpdateUserDto, UpdatePasswordDto } from "../services/mypage/mypage.dto.js";

const MypageController = {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;

      const user = await MypageService.getUser(userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req: RequestWithDto<UpdateUserDto>, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const updateUserDTO = req.body;
      const updatedUser = await MypageService.updateUser(userId, updateUserDTO);
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req: RequestWithDto<UpdatePasswordDto>, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const updatePasswordDTO = req.body;

      const { accessToken, refreshToken } = await MypageService.updatePassword(userId, updatePasswordDTO);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json("비밀번호 변경 및 토큰 재발급이 완료되었습니다.");
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;

      await MypageService.deleteUser(userId);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(204).json("회원 탈퇴가 완료되었습니다.");
    } catch (err) {
      next(err);
    }
  },

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;

      const products = await MypageService.getProducts(userId);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  async getLikeProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;

      const products = await MypageService.getLikeProducts(userId);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
};

export default MypageController;
