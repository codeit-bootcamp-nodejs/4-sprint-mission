import passport, { serializeUser } from 'passport'
// import          from 'passport-local'

import prisma from 'lib/prisma.js';


passport.serializeUser( function(user, done) {
    done(null, user)
})


passport.deserializeUser( function(id,done) {
    user.findbyID(id, function (err,user){
        done(err,user)
    })
})