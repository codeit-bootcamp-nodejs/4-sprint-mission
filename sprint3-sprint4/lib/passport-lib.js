import passport, { serializeUser } from 'passport'

import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt';

import prisma from 'lib/prisma.js';
import bcrypt from 'bcrypt';

import ACCESS_SECRET_KEY from './constants.js'
import REFRESH_SECRET_KEY from './constants.js'


//secret key를 설정하기
const accessJwtOptions = {
    secretOrKey: ACCESS_SECRET_KEY
}
const refreshJwtOptions = {
    secretOrKey: REFRESH_SECRET_KEY
}

/*
payload = {
    userId : 
}
*/

//Access Token을 검증하는 전략 
const accessJwtStrategy = new JwtStrategy(accessJwtOptions, (payload, done) => {
    const user = prisma.user.findUnique({
        where:{id: payload.userId}
    });
    if (user){
        return done(null, user);
    }else {
        return done(null, false);
    }
})

//Refresh Token을 검증하는 전략 
const refreshJwtStrategy = new JwtStrategy(refreshJwtOptions, (payload, done) => {
    const user = prisma.user.findUnique({
        where:{id: payload.userId}
    });
    if (user){
        return done(null, user);
    }else {
        return done(null, false);
    }
})


passport.use('AccessToken', accessJwtStrategy)
passport.use('RefreshToken', refreshJwtStrategy)

