import passport from "passport";
import type { Controller } from "../types/controller.js";
import type { User as PrismaUser } from "@prisma/client";

interface OptionalAuthDto {
  userId: number;
}
type optionalAuthController = Controller<
  unknown,
  unknown,
  OptionalAuthDto | undefined
>;
type PassportUser = Pick<PrismaUser, "id">;

// 로그인은 선택 사항인 인증 미들웨어
export const optionalAuth: optionalAuthController = (req, res, next) => {
  passport.authenticate(
    "access-token",
    { session: false },
    (err: Error | null, user: PassportUser | false) => {
      if (err) return next(err);
      if (user) {
        req.user = user;
      } // 인증 성공했을 때만 req.user 세팅
      next(); // 실패해도 그냥 통과
    }
  )(req, res, next);
};
