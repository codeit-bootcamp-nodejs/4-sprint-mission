import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma.js";

// LocalStrategy 설정 (이메일과 비밀번호로 로그인)
export const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async function (email, password, done) {
    try {
      // 이메일로 사용자 찾기
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log("사용자를 찾을 수 없습니다.");
        return done(null, false, { message: "사용자를 찾을 수 없습니다." });
      }

      // 비밀번호 비교
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("비밀번호가 일치하지 않습니다.");
        return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
      }

      // 비밀번호가 일치하면 사용자 반환
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);
