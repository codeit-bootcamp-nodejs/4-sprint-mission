import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from '../prisma.js';

const ACCESS_KEY = process.env.JWT_ACCESS_SECRET;
const REFRESH_KEY = process.env.JWT_REFRESCH_SECRET;

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_KEY,
};
const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[refresh-token],
  secretOrKey: REFRESH_KEY,
};

async function jwtVerify(payload, done){
  try{
    const user = await prisma.user.findUnique({
      where: { id: payload.sub}
    });
    done(null, user);
  } catch(error){
    done(error, false);
  }
}

export const accessTokenStrategy = new JwtStrategy (accessTokenOptions, jwtVerify);
export const refreshTokenStrategy = new JwtStrategy (refreshTokenOptions, jwtVerify);