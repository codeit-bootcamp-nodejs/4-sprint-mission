import { prismaClient } from '../lib/prismaClient';
import User from '../types/User';

export async function getUser(id: number): Promise<User | null> {
  const user = await prismaClient.user.findUnique({
    where: { id },
  });
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  return user;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const user = await prismaClient.user.create({
    data,
  });
  return user;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const user = await prismaClient.user.update({
    where: { id },
    data,
  });
  return user;
}
