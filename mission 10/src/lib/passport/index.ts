import passport from 'passport';
import { localStrategy } from './localStrategy';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy';

passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;
