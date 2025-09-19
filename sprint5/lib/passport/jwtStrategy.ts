import type { Request } from "express";
import { Strategy as JwtStrategy } from "passport-jwt";
import prisma from "../prisma.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../constants.js";

interface JwtPayload {
  sub: string;
}

type VerifiedCallback = (
  error: any,
  user?: Express.User | false,
  info?: object
) => void;

const accessTokenOptions = {
  jwtFromRequest: (req: Request) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: Request) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.sub, 10) },
    });

    console.log(user);

    if (!user) {
      return done(null, false, { message: "Unauthorized" }); // 인증 실패
    }

    done(null, user);
  } catch (error) {
    done(error, false);
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
