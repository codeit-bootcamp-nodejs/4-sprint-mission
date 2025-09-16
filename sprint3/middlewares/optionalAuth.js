import passport from "passport";

export const optionalAuth = (req, res, next) => {
  passport.authenticate("access-token", { session: false }, (err, user) => {
    if (user) {
      req.user = user; // 인증 성공한 경우만 user 저장
    }
    next(); // 인증 실패여도 계속 진행
  })(req, res, next);
};
