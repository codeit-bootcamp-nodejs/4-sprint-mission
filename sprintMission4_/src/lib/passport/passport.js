// passport 전략 모아두기 
import passport from 'passport';
import prisma from '../prisma.js';
import { localStrategy } from './localStrategt.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

// 토큰은 그냥 paylaod에 필요한 내용(민감하지 않은) Pk 값을 들고 다니는 것 -> 그 Pk 값을 통해 데이터베이스 상호작용할 수 있도록
// serializeUser, deserializeUser --> passport session 전략 사용할 때 사용한다. 
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;