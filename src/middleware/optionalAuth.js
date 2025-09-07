import passport from "passport";

// 로그인은 선택 사항인 인증 미들웨어
export function optionalAuth(req, res, next) {
  passport.authenticate("access-token", { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user; // 인증 성공했을 때만 req.user 세팅
    return next(); // 실패해도 그냥 통과
  })(req, res, next);
}
