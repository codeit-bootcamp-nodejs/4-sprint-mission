import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import { AuthService } from "../../service/auth.service.js";
type VerifyCallBack = (error: any, user?: any, info?: any) => void;

const authService = new AuthService(prisma);
export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, passowrd: string, cb: VerifyCallBack) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user || !user.password)
        return cb(null, false, " 존재 하지 않는 입니다");

      const isMatch = await bcrypt.compare(passowrd, user.password);

      if (!isMatch) {
        return cb(null, false, "틀린 비밀번호 입니다");
      } else {
        cb(null, user);
      }
    } catch (error) {
      cb(error)
    }
  }
);
