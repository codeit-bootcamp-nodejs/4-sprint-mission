// passport 전략 모아두기 
import passport from 'passport';

import { localStrategy } from './localStrategt.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.use('local', localStrategy);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;