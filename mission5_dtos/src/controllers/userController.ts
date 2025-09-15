import { Request, Response, NextFunction } from "express";
import status from "http-status";
import { UserService } from "../services/userService";
import { setTokenCookies, clearTokenCookies } from "../lib/cookieUtil";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { email, nickname, password } = req.body;
    try {
      const result = await userService.register(email, nickname, password);
      res.status(status.CREATED).json(result);
    } catch (err: any) {
      if (err.message === "EMAIL_EXISTS") {
        return res.status(status.CONFLICT).json({ message: "This ID already exists" });
      }
      next(err);
    }
  }

  login(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });

    try {
      const { accessToken, refreshToken } = userService.generateUserTokens(req.user.id);
      setTokenCookies(res, accessToken, refreshToken);
      res.status(status.OK).json({ token: accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const profile = await userService.getProfile(req.user.id);
      res.status(status.OK).json(profile);
    } catch (err) {
      next(err);
    }
  }

  async modifyInformation(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const updatedUser = await userService.updateInformation(req.user.id, req.body.nickname, req.body.image);
      res.status(status.OK).json({ message: "User information updated successfully", user: updatedUser });
    } catch (err: any) {
      if (err.message === "NO_DATA") return res.status(status.BAD_REQUEST).json({ message: "No update data provided" });
      next(err);
    }
  }

  async modifyPassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
      const result = await userService.updatePassword(req.user.id, req.body.password);
      res.status(status.OK).json(result);
    } catch (err) {
      next(err);
    }
  }

  async products(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
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
    if (!req.user) return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { accessToken, refreshToken } = userService.generateUserTokens(req.user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(status.OK).send({ message: "Tokens refreshed" });
  }

  logout(req: Request, res: Response) {
    clearTokenCookies(res);
    res.status(status.OK).send({ message: "Logged out successfully" });
  }
}
