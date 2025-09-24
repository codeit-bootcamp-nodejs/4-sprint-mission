import { Strategy as JwtStrategy } from "passport-jwt";
import prisma from "../prisma.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../constants.js";
import type { Request } from "express";
import type { VerifiedCallback } from "passport-jwt";
import { verifyAccessToken, verifyRefreshToken } from "../token.js";

// Access Token 전략
export const accessTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: (req: Request) => req.cookies?.[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: "dummy", // jose로 검증하므로 더 이상 사용하지 않음
    passReqToCallback: true,
  },
  async (req: Request, payload, done: VerifiedCallback) => {
    try {
      const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
      if (!token) return done(null, false);

      const { userId } = await verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: userId } });
      done(null, user || false);
    } catch (err) {
      done(err as Error, false);
    }
  }
);

// Refresh Token 전략
export const refreshTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: (req: Request) => req.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: "dummy", // jose로 검증하므로 더 이상 사용하지 않음
    passReqToCallback: true,
  },
  async (req: Request, payload, done: VerifiedCallback) => {
    try {
      const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
      if (!token) return done(null, false);

      const { userId } = await verifyRefreshToken(token);
      const user = await prisma.user.findUnique({ where: { id: userId } });
      done(null, user || false);
    } catch (err) {
      done(err as Error, false);
    }
  }
);
