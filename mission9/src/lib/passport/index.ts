import passport from "passport";
import { accessTokenStrategy, refreshTokenStrategy } from "./jwtStrategy.js";
import { localStrategy } from "./localStrategy.js";
import prisma from "../prisma.js";

passport.use("local", localStrategy);
passport.use("access-token", accessTokenStrategy);
passport.use("refresh-token", refreshTokenStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async function (id: number, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
