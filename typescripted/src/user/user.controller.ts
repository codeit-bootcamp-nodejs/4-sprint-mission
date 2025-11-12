import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { ParamsDictionary } from "express-serve-static-core";
import { ValidatedRequest } from "../middleware/validateReq";
import { success } from "zod";
// request
export interface RequestUserParams extends ParamsDictionary {
  id: string;
}
export interface RequestUserBody {
  email?: string | null;
  nickname?: string | null;
  password?: string | null;
  [key: string]: any;
}

//회원 정보 수정 인터페이스 to service
export interface IPatchUserInfo {
  email: string | null;
  nickname: string | null;
}
export interface IPatchUserPassword {
  currentPassword: string;
  newPassword: string;
}
//  respoonse

const userService = new UserService();

export class UserController {
  async getUserInfoCont(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const userInfo = await userService.getUserInfo({ id: userId });
      return res.json({ success: true, data: userInfo });
    } catch (error) {
      next(error);
    }
  }
  async patchUserCont(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const { email, nickname } = req.body as any;
      const modifiedUser = await userService.patchUserInfo(userId, {
        email,
        nickname,
      });
      return res.json({ success: true, data: modifiedUser });
    } catch (error) {
      next(error);
    }
  }
  async patchUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("요청 들어옴");
      const userId = Number(req.params.id);
      const { currentPassword, newPassword } = req.body;
      console.log("요청 인덱스:", userId);
      console.log(req.body);
      const changedPassword = await userService.patchedPassword(userId, {
        currentPassword,
        newPassword,
      });
      return res.json({ success: true ,data: changedPassword});
    } catch (error) {
      next(error);
    }
  }
}
