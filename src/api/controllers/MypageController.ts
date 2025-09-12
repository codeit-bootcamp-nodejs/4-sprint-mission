import MypageService from "../services/MypageService.js";
import type { Request, Response, NextFunction } from "express";
import type { UpdateUserDTO, UpdatePasswordDTO } from "../types/dtos/mypage.dto.js";

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

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const updateData: UpdateUserDTO = req.body;
      const updatedUser = await MypageService.updateUser(userId, updateData);
      res.status(201).json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user;
      const updatePasswordData: UpdatePasswordDTO = req.body;

      await MypageService.updatePassword(userId, updatePasswordData);
      res.status(201).json("비밀번호 변경이 완료되었습니다.");
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
