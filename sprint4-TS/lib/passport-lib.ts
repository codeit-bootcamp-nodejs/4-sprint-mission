import passport from 'passport'
import type { Request, Response, NextFunction } from 'express';

import { Strategy as JwtStrategy } from 'passport-jwt';

import prisma from './prisma.js';


import {ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
 }from './constants.js'

interface payload{
    userId: number
}


//request로 부터 token을 받고, 해석하는 부분(options)
const accessJwtOptions = {
    jwtFromRequest : (req:Request) => 
        req.cookies[ACCESS_TOKEN_COOKIE_NAME],
        secretOrKey: ACCESS_SECRET_KEY
}
const refreshJwtOptions = {
    jwtFromRequest : (req:Request) => 
        req.cookies[REFRESH_TOKEN_COOKIE_NAME],
        secretOrKey: REFRESH_SECRET_KEY
}


//passport에서 인증이 이루어지는 부분(verify)
async function jwtVerify(payload:payload, done){
    const userId = payload.userId;
    if (!userId){
        done(Error,null);
    }
    const user = await prisma.user.findUnique({
        where:{id:userId}
    })
    if (!user){
        done(Error,null);
    }
    done(null,user);
}

//Access Token을 검증하는 전략 
export const accessJwtStrategy = new JwtStrategy(accessJwtOptions, (payload, done) => {
    jwtVerify
})

//Refresh Token을 검증하는 전략 
export const refreshJwtStrategy = new JwtStrategy(refreshJwtOptions, (payload, done) => {
    jwtVerify
})


passport.use('AccessToken', accessJwtStrategy)
passport.use('RefreshToken', refreshJwtStrategy)

// export const authUserWithParmaId = passport.authenticate("Access Token", (req,res) =>{
//     const paramId = req.params.id;
//     const tokenId = req.user.id

//     if (paramId != tokenId){
//         return res.send("no authorization")
//     }else{
//         return next()
//     }
// })