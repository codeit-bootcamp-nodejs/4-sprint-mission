import { Strategy as LocalStrategy } from 'passport-local';
import * as authService from '../../services/authService.js';

const localStrategy = new LocalStrategy(
    {
        usernameField: 'email', // Passport Local의 기본값은 username이지만, email로 변경
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await authService.findUserAndVerifyPassword(email, password);
            if (!user) {
                // authService에서 null을 반환하면, done(null, false) 호출
                return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            }
            // 인증 성공 시, Passport.js의 done 함수에 user 객체를 전달
            return done(null, user);
        } catch (err) {
            // 서비스에서 Error 객체를 throw한 경우 (DB 오류 등) done 함수에 에러 객체를 전달
            return done(err);
        }
    }
);

export default localStrategy;
