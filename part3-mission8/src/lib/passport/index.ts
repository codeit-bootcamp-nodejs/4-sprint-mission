import passport from 'passport';
import { localStrategy } from './localStrategy.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

// 전략 등록
passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

// 미들웨어 export
export const localAuth = passport.authenticate('local', { session: false });
export const accessAuth = passport.authenticate('access-token', {
  session: false,
});
export const refreshAuth = passport.authenticate('refresh-token', {
  session: false,
});

export default passport;
