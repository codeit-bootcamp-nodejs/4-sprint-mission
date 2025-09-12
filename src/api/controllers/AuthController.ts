import AuthService from "../services/AuthService.js";
import type { Request, Response, NextFunction } from "express";
import type { SignupDto, LoginDto } from "../types/dtos/user.dto.js";

const AuthController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signupData: SignupDto = req.body;
      const newUser = await AuthService.signup(signupData);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginDto = req.body;
      const { userWithoutPassword: user, accessToken, refreshToken } = await AuthService.login(loginData);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.refreshAccessToken(req.cookies.refreshToken);
      if (!result) {
        return res.status(401).json({ error: "유효하지 않은 리프레시 토큰입니다." });
      }
      const { accessToken, refreshToken: newRefreshToken } = result;

      // 쿠키에 토큰 저장
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  },
};

export default AuthController;
