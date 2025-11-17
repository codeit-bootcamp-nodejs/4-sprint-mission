import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import prisma from "../../lib/prisma";
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
} from '../../lib/constants'
import {Request} from 'express'
import { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";

// acccess token 옵션
const  accessTokenOptions = {
    jwtFromRequest:(req: Request) =>req.cookies[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_ACCESS_TOKEN_SECRET
}
// refresh token 옵션
const  refreshTokenOptions={
    jwtFromRequest:(req: Request) =>req.cookies[REFRESH_TOKEN_COOKIE_NAME],
     secretOrKey: JWT_REFRESH_TOKEN_SECRET
}
// jwt 인증 비동기 함수
async function jwtVerify(
    payload: { id: number },
    done: (error:any, user?:User|false, options?:{message:string}) => void
) {
    try {
        if (!payload.id) return done(null, false);
        const user = await prisma.user.findUnique({where:{id:payload.id}})
        if(!user) return done(null,false)
        done(null,user)
    } catch (error) {
         done(error, false);
    }
}

// acccess token  전략
export const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

// refresh token 전략
export const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);



