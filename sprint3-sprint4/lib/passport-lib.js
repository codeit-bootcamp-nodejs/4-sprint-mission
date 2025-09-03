import passport, { serializeUser } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt';
import JwtStrategy from 'passport-jwt';
import prisma from 'lib/prisma.js';
import bcrypt from 'bcrypt';



passport.serializeUser( function(user, done) {
    done(null, user)
})


passport.deserializeUser( function(id,done) {
    user.findbyID(id, function (err,user){
        done(err,user)
    })
})


class Strategy{
    
    jwtStrategy = ()=> {
        const jwtStrategy = new JwtStrategy()
    }

    // 사용자가 아이디, 비밀번호를 제출할 때 유저 인증 strategy
    localStrategy = async (req,res,next) =>{
        const userId = req.params.userId;
        const password = req.body.password;

        const newLocalStrategy = new LocalStrategy( (userId, password), 
            async(userId, password,done) =>{

                const user = await prisma.user.findUnique({where: {id:userId}})
                
                if (!user){
                    return done(null, false)
                }

                const isMatch = await bcrypt.compare(password, user.password)
                if (isMatch){
                    return done(null, user);
                }else {
                    return done(null, false)
                }
            })

        return newLocalStrategy(userId,password);
    }
}

passport.use(Strategy.jwtStrategy)
passport.use(Strategy.localStrategy)
export default passportStrategy