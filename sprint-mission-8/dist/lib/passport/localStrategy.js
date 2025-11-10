import passportLocal from "passport-local";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
const LocalStrategy = passportLocal.Strategy;
export const localStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        // console.log(`로그인 시도 : ${email}, ${password}`);
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return done(null, false, { message: "유저 못찾음" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "비밀번호 오류" });
        }
        done(null, user);
    }
    catch (err) {
        console.error("에러 : " + err);
        return done(err);
    }
});
//# sourceMappingURL=localStrategy.js.map