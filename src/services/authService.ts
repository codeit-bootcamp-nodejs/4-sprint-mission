import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';
import * as usersRepository from '../repositories/usersRepository';
import BadRequestError from '../lib/errors/BadRequestError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import User from '../types/User';

interface JwtPayload {
  id: number;
  email: string;
}

export async function signUp(email: string, nickname: string, password: string) {
  const existingUser = await usersRepository.getUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await usersRepository.createUser({
    email,
    nickname,
    password: hashedPassword,
    image: null,
  });

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  return { user, accessToken };
}

export async function signIn(email: string, password: string) {
  const user = await usersRepository.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  return { user, accessToken };
}

export async function authenticate(accessToken: string): Promise<User> {
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
    const user = await usersRepository.getUser(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

export async function updateMyPassword(userId: number, password: string, newPassword: string) {
  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await usersRepository.updateUser(userId, { password: hashedPassword });
}
