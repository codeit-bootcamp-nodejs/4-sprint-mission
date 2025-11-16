import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: false,
  },
  async function (email: string, password: string, done) {
    try {
      // 이메일로 사용자 찾기
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const err: HttpError = new Error("잘못된 이메일 또는 비밀번호입니다.");
        err.status = 401;
        return done(err);
      }

      // 비밀번호 비교
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const err: HttpError = new Error("잘못된 이메일 또는 비밀번호입니다.");
        err.status = 401;
        return done(err);
      }

      // 비밀번호가 일치하면 사용자 반환
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
