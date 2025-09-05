import { Strategy as JwtStrategy } from "passport-jwt";
import prisma from "../prisma.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../constants.js";

const accessTokenOptions = {
  jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
  /*
  jwtFromRequest: (req) => {
    const token = req.headers["authorization"]; // Bearer <token>
    if (!token || token.split(" ")[0] !== "Bearer") {
      throw new Error("Unauthorized");
    }
    return token && token.split(" ")[1]; // 'Bearer <token>'에서 <token>만 추출
  },
  */
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify(payload, done) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
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
