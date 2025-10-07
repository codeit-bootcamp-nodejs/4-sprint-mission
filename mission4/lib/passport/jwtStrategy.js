import prisma from '../prisma.js'
import { Strategy as JwtStrategy } from 'passport-jwt'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../constants.js'; // lib

const accessTokenOptions = {
    jwtFromRequest : (req) => req.cookie[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey :JWT_ACCESS_TOKEN_SECRET
}
const refreshTokenOptions = {
    jwtFromRequest : (req) => req.cookie[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey : JWT_REFRESH_TOKEN_SECRET
}

async function jwtVerify(patload, done) {
    try {
        const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        })
        done(null, user)
    }catch(error){
        done(null,false)
    }
}
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);