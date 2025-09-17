import passport from "passport";
import prisma from "../prisma.js";
import { localStrategy } from "./localStrategy.js";
import { accessTokenStrategy, refreshTokenStrategy } from "./jwtStrategy.js";
import { googleStrategy } from "./oauthStrategy.js";
import type { User as PrismaUser } from "@prisma/client";

passport.use("local", localStrategy);
passport.use("access-token", accessTokenStrategy);
passport.use("refresh-token", refreshTokenStrategy);
passport.use("google", googleStrategy);

passport.serializeUser(function (user: Partial<PrismaUser>, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id: number, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;
