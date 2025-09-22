import passport from 'passport';
import  accessTokenStrategy   from '../lib/middlewares/passport/jwtStrategy'; 

passport.use('access-token', accessTokenStrategy);

export default passport;