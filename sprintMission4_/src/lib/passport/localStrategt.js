import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma.js';

export const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async function ( email, password, done) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return done(null, false);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return done(null, false);
  }
  done(null, user);

});
