import passport from 'passport';
import localStrategy from '../middlewares/localStrategy.js';
import accessTokenStrategy from '../middlewares/jwtStrategy.js';

passport.use(localStrategy);
passport.use('access-token', accessTokenStrategy);

export default passport;