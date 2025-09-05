import passport, { serializeUser } from 'passport'

import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt';

import prisma from 'lib/prisma.js';
import bcrypt from 'bcrypt';

import {ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
 }from './constants.js'
import REFRESH_SECRET_KEY from './constants.js'


//secret key를 설정하기
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


//미완성!!!!!

async function jwtVerify(payload, done){
    
    const user = await prisma.user
    
}

//미완성!!!!!!!




/*
payload = {
    userId : 
}
*/

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

