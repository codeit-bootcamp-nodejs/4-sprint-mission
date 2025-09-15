import passport from 'passport';
import prisma from '../prisma.js';
import { localStrategy } from './localStrategy.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;
