import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";// 
import prisma from "../../lib/prisma"; // TS에서는 보통 .ts 확장자 생략

// Prisma User 타입 불러오기

// 로직 
// - 클라이언트가 로그인을 할시에 
// - 아이디 비밀번호 존재 유무 확인
// - 로그인 결과 내보내기
import { User } from "@prisma/client";

export const localeStrategy = new LocalStrategy(
    {
        usernameField:"email",
        passwordField: "password"
    },
    async( email: string, password: string, done :(error: any, user?:User|false, option?:{ message: string} ) => void)=>{
        try {
            const user = await prisma.user.findUnique({
                where:{ email }
            })
            if(!user || !user.password) return done(null, false, { message: "Invalid credentials" });

            const isValid = await bcrypt.compare(password, user.password)

            if(!isValid) return done(null,false, {message:"유효하지 않는 비밀번호"})
            
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
)