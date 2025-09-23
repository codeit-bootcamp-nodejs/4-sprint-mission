import passport from 'passport';
import localStrategy from '../middlewares/localStrategy.js';
import jwtStrategy from '../middlewares/jwtStrategy.js';

passport.use(localStrategy);
passport.use('access-token', jwtStrategy.accessTokenStrategy);
passport.use('refresh-token', jwtStrategy.refreshTokenStrategy);

export default passport;