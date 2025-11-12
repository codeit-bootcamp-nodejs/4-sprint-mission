import passport from 'passport';
import prisma from '../../lib/prisma';
import { localeStrategy } from './localStrategy';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy'
import { User } from '@prisma/client';

passport.use('local',localeStrategy )
passport.use('access-token', accessTokenStrategy)
passport.use('refresh-token', refreshTokenStrategy)




passport.serializeUser((user:User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user || false );
});

export default passport