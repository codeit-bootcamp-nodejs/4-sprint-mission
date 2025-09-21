import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy.js';
import * as jwtStrategy from '../middlewares/passport/jwtStrategy.js';

passport.use('local', localStrategy);
passport.use('accessToken', jwtStrategy.accessTokenStrategy);
passport.use('refreshToken', jwtStrategy.refreshTokenStrategy);

export default passport;
