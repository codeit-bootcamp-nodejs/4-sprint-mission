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
        return done(null, false, { message: "닉네임이 올바르지 않습니다." });
      }

      if (!user.password) {
        // 비밀번호 없는 계정(소셜 로그인 등) 처리
        return done(null, false, {
          message: "이 계정은 비밀번호가 설정되어 있지 않습니다.",
        });
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "비밀번호가 올바르지 않습니다." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
