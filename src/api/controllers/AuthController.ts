import AuthService from "../services/auth/AuthService.js";
import type { Request, Response, NextFunction } from "express";
import type { SignupDto, LoginDto } from "../types/dtos/auth.dto.js";

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
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "로그인된 사용자만 로그아웃할 수 있습니다." });
      }

      await AuthService.logout(req.user.id);

      // 쿠키에서 토큰 제거
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      res.status(200).json({ message: "로그아웃 되었습니다." });
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
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  },
};

export default AuthController;
