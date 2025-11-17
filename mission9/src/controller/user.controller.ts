import type { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service.js";
import type { ChangePasswordDTO } from "../dto/user.dto.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async accessUserProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unathorized");

      const result = await this.userService.accessUserProducts(userId);
      res.status(200).json({
        message: "유저가 등록한 상품 리스트 조회 성공",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async accessUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) throw new Error("unathorized");

      const result = await this.userService.accessUserInfo(userId);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async modifyUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);

      const { nickname, email } = req.body as {
        nickname: string;
        email: string;
      };

      if (!userId) throw new Error("Unauthorized");

      const result = await this.userService.modifyUserInfo({
        id: userId,
        nickname,
        email,
      });

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async modifyUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const { currentPassword, newPassword } = req.body as ChangePasswordDTO;
      const result = await this.userService.modifyUserPassword(userId, {
        currentPassword,
        newPassword,
      });
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
