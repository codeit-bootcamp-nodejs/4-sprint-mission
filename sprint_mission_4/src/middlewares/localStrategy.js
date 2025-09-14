import { Strategy as LocalStrategy } from 'passport-local';
import userService from '../services/userService.js';

//로그인 시에 데이터에 저장되어 있는 거랑 맞는지 확인 절차
const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        try {
            const user = await userService.getUser(email, password);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
);

export default localStrategy;