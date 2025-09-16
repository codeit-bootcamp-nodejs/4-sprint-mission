import { Strategy as LocalStrategy } from "passport-local";
import { verifyPassword } from "../hash.js";
import prisma from "../prisma.js";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "nickname", // username → nickname
    passwordField: "password",
  },
  async (nickname, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { nickname } });
      if (!user) {
        return done(null, false, { message: "Incorrect nickname." });
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
