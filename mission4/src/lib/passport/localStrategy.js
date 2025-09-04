import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma.js';

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',     // 👈 email을 username 대신 쓰도록 지정
    passwordField: 'password',  // (기본값이라 안 써도 되지만 명시하면 좋음)
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user); // 👈 user 객체에 id 꼭 있어야 함
    } catch (err) {
      return done(err);
    }
  }
);