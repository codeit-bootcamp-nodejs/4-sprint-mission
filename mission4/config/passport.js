import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import accessTokenStrategy from '../lib/middlewares/passport/jwtStrategy.js';

passport.use('access-token', accessTokenStrategy);

export default passport;