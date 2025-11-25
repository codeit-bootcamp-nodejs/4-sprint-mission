import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from '../prisma';
import type { Request } from 'express';
import type { VerifiedCallback } from 'passport-jwt';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../constants';

interface JwtPayload {
  sub: number;
}

// const accessTokenOptions = {
//   jwtFromRequest: (req: Request) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
//   secretOrKey: JWT_ACCESS_TOKEN_SECRET,
// };

const accessTokenOptions = {
  jwtFromRequest: (req: Request) => {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME] || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  },
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: Request) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
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
