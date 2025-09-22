import { setJwtTokens } from "../../../lib/token.js";
import passports from "../../../lib/passport/index.js";

export default function loginUser(req, res, next) {
  passports.passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      console.log("로그인 시도");
      if (err) return next(err);
      if (!user)
        return res.status(401).json({ message: "로그인 실패, 유저 없음" });
      req.user = user;

      const tokens = setJwtTokens(req, res);

      res.status(200).json({
        message: "로그인",
        data: {
          accessHeader: tokens.accessToken,
          refreshHeader: tokens.refreshToken,
        },
      });
    }
  )(req, res, next);
}
