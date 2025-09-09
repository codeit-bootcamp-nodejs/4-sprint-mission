import passport from 'passport';
import { prisma } from '../prismaClient.js';
import { localStrategy } from './localStrategy.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.serializeUser(function (user: any, done) {
  done(null, user.id as string | number);
});

passport.deserializeUser(async function (id: number, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

passport.use('local', localStrategy);
passport.use('jwt', accessTokenStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;
