import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email", // email을 localStrategy의 고정값 'username' 대신 쓰도록 지정
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: "No user found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
