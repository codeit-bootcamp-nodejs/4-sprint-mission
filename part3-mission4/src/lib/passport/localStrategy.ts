import * as PassportLocal from 'passport-local';
const LocalStrategy = PassportLocal.Strategy;
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient.js';

export const localStrategy = new LocalStrategy(async function (
  username: string,
  password: string,
  done: (error: any, user?: any, info?: any) => void
) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return done(null, false);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return done(null, false);
  }

  done(null, user);
});
