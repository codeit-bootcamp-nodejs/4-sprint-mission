import TOKEN from "../constants/jwt.tokens.js";
import { Strategy as JwtStrategy, type VerifiedCallback } from "passport-jwt";
import prisma from "../prisma.js";
import type { Request } from "express";

const accessTokenOptions = {
  jwtFromRequest: (req: Request) => req.cookies[TOKEN.ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: TOKEN.JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: Request) =>
    req.cookies[TOKEN.REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: TOKEN.JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload: { id: number }, done: VerifiedCallback) {
  try {
    console.log("jwt 인증 시작, payload : " + payload.id);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
      },
    });
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);
