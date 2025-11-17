import express from "express";
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service.js";
import type { RegisterDTO, LoginDTO } from "../dto/auth.dto.js";
import { WebsocketService } from "../socket/socket.js";
import prisma from "../lib/prisma.js";

export class AuthController {
  private wss: WebsocketService;
  private authService: AuthService;
  constructor(wss: WebsocketService) {
    this.authService = new AuthService(prisma); // 공통 자원은 한 번만 생성
    this.wss = wss;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, nickname, password } = req.body as RegisterDTO;
      const newUser = await this.authService.register({
        email,
        nickname,
        password,
      });

      return res.status(201).json({
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      throw new Error("인터널 서버 에러"); // 500
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDTO; // req.query는 스스로 타입 가지고 있다

      if (!req.user || !req.user.id || !req.user.email) {
        throw new Error();
      }
      const userId = Number(req.user.id);
      const result = await this.authService.login(userId, { email, password });
      return res.status(200).json({
        message: "로그인 성공",
        data: result,
      });
    } catch (error) {
      console.error(error);
      throw new Error("인터널 서버 에러"); // 500
    }
  }
}
