import passport from 'passport'

import { Strategy as JwtStrategy } from 'passport-jwt';

import prisma from 'lib/prisma.js';


import {ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
 }from './constants.js'
import REFRESH_SECRET_KEY from './constants.js'


//request로 부터 token을 받고, 해석하는 부분(options)
const accessJwtOptions = {
    jwtFromRequest : (req) => 
        req.cookies[ACCESS_TOKEN_COOKIE_NAME],
        secretOrKey: ACCESS_SECRET_KEY
}
const refreshJwtOptions = {
    jwtFromRequest : (req) => 
        req.cookies[REFRESH_TOKEN_COOKIE_NAME],
        secretOrKey: REFRESH_SECRET_KEY
}


//passport에서 인증이 이루어지는 부분(verify)
async function jwtVerify(payload, done){
    const userId = payload.userId
    if (!userId){
        done(error,null);
    }
    const user = await prisma.user.findUnique({id:userId})
    if (!user){
        done(error,null);
    }
    done(null,user);
}

//Access Token을 검증하는 전략 
const accessJwtStrategy = new JwtStrategy(accessJwtOptions, (payload, done) => {
    accessJwtOptions,
    jwtVerify
})

//Refresh Token을 검증하는 전략 
const refreshJwtStrategy = new JwtStrategy(refreshJwtOptions, (payload, done) => {
    refreshJwtOptions,
    jwtVerify
})


passport.use('AccessToken', accessJwtStrategy)
passport.use('RefreshToken', refreshJwtStrategy)

