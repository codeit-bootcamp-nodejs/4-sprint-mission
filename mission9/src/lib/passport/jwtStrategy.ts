import {
  type StrategyOptions,
  type VerifiedCallback,
  Strategy as JwtStrategy,
} from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import prisma from "../prisma.js";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../constants.js";

interface JwtPayload {
  sub: number;
  email?: string;
  iat?: number;
  exp?: number;
}

const accessTokenOptions: StrategyOptions = {
  jwtFromRequest: (req) => {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return token;
  },
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions: StrategyOptions = {
  jwtFromRequest: (req) => {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return token;
  },
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
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
