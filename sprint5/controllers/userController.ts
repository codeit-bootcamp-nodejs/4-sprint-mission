import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService.js";

export const userController = {
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.findUser(req.user!.id);

      if (!user) {
        return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  patchUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const user = await userService.updateUser(req.user!.id, data);

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  patchPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;

      await userService.updatePassword(req.user!.id, password);

      res.status(200).json({ message: "비밀번호 변경 완료" });
    } catch (err) {
      next(err);
    }
  },

  getUserProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProduct = await userService.findUserProduct(req.user!.id);

      res.status(200).json(userProduct);
    } catch (err) {
      next(err);
    }
  },

  getLikedProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await userService.findLikedProducts(req.user!.id);

      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
};
