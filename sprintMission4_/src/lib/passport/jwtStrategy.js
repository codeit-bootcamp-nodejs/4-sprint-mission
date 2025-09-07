import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from '../prisma.js';


const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[refresh-token],
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload, done){
  try{
    const user = await prisma.user.findUniqe({
      where: { id: payload.sub}
    });
    done(null, user);
  } catch(error){
    done(error, false);
  }
}

export const accessTokenStrategy = new JwtStrategy (accessTokenOptions, jwtVerify);
export const refreshTokenStrategy = new JwtStrategy (refreshTokenOptions, jwtVerify);