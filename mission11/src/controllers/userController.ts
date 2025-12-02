import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { UserService } from "../services/userService";
import { setTokenCookies, clearTokenCookies } from "../lib/cookieUtil";
import {
  UserRegisterSchema,
  UserUpdateSchema,
  UserPasswordSchema,
  UserLoginSchema,
} from "../dtos/user.dto";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = UserRegisterSchema.parse(req.body);
      const result = await userService.register(parsed);
      res.status(status.CREATED).json(result);
    } catch (err: any) {
      if (err.message === "EMAIL_EXISTS") {
        return res
          .status(status.CONFLICT)
          .json({ message: "This ID already exists" });
      }
      next(err);
    }
  }

  login(req: Request, res: Response, next: NextFunction) {
    if (!req.user)
      return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });

    try {
      const { accessToken, refreshToken } = userService.generateUserTokens(
        req.user.id
      );
      setTokenCookies(res, accessToken, refreshToken);

      res.status(status.OK).json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      const profile = await userService.getProfile(req.user.id);
      res.status(status.OK).json(profile);
    } catch (err) {
      next(err);
    }
  }

  async modifyInformation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: "Unauthorized" });

      const parsed = UserUpdateSchema.parse(req.body); // DTO 검증
      const updatedUser = await userService.updateInformation(
        req.user.id,
        parsed.nickname,
        parsed.image
      );

      res.status(status.OK).json({
        message: "User information updated successfully",
        user: updatedUser,
      });
    } catch (err: any) {
      if (err.message === "NO_DATA")
        return res
          .status(status.BAD_REQUEST)
          .json({ message: "No update data provided" });
      next(err);
    }
  }

  async modifyPassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: "Unauthorized" });

      const parsed = UserPasswordSchema.parse(req.body); // DTO 검증
      const result = await userService.updatePassword(req.user.id, parsed);

      res.status(status.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      await userService.deleteAccount(req.user.id);
      return res.status(status.OK).send();
    } catch (error) {
      next(error);
    }
  }

  async products(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        return res
          .status(status.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      const products = await userService.getProducts(req.user.id);
      if (!products || products.length === 0) {
        return res.status(status.NOT_FOUND).json({ message: "No product" });
      }
      res.status(status.OK).json(products);
    } catch (err) {
      next(err);
    }
  }

  refreshTokens(req: Request, res: Response) {
    if (!req.user)
      return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { accessToken, refreshToken } = userService.generateUserTokens(
      req.user.id
    );
    setTokenCookies(res, accessToken, refreshToken);
    res.status(status.OK).send({ message: "Tokens refreshed" });
  }

  logout(req: Request, res: Response) {
    clearTokenCookies(res);
    res.status(status.OK).send({ message: "Logged out successfully" });
  }
}
