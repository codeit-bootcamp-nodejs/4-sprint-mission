import bcrypt from 'bcrypt';
import * as authRepository from '../repositories/authRepository';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export async function register(data: {
  email: string;
  password: string;
  nickname: string;
  image?: string;
}) {
  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user = await authRepository.createUser(data);
  return user;
}

export async function login(email: string, password: string) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken, user };
}
