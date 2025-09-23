import passport from 'passport';
import prisma from '../prismaClient.js';
import { localStrategy } from './localStrategy.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.use('local', localStrategy);
passport.use('jwt', accessTokenStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;
