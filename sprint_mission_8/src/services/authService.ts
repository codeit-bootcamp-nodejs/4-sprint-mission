import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/usersRepository';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../lib/token';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import User from '../types/User';

type RegisterData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type LoginData = Pick<User, 'email' | 'password'>;

async function verifyPassword(user: User, password: string) {
  return await bcrypt.compare(password, user.password);
}

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function register(data: RegisterData) {
  const existingUser = await usersRepository.getUserByEmail(data.email);
  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await usersRepository.createUser({
    email: data.email,
    nickname: data.nickname,
    password: hashedPassword,
    image: data.image,
  });

  return user;
}

export async function login(data: LoginData) {
  const user = await usersRepository.getUserByEmail(data.email);
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await verifyPassword(user, data.password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(refreshToken?: string) {
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { userId } = verifyRefreshToken(refreshToken);

  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function updateMyPassword(userId: User['id'], password: string, newPassword: string) {
  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new NotFoundError('user', userId);
  }

  const isPasswordValid = await verifyPassword(user, password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const hashedPassword = await hashPassword(newPassword);
  await usersRepository.updateUser(userId, { password: hashedPassword });
}

export async function authenticate(accessToken?: string) {
  if (!accessToken) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { userId } = verifyAccessToken(accessToken);
  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }
  return user;
}
