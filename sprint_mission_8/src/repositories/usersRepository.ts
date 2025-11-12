import { User } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  const createdUser = await prismaClient.user.create({
    data,
  });
  return createdUser;
}

export async function getUser(id: number) {
  const user = await prismaClient.user.findUnique({
    where: { id },
  });
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  return user;
}

export async function updateUser(id: number, data: Partial<User>) {
  const updatedUser = await prismaClient.user.update({
    where: { id },
    data,
  });
  return updatedUser;
}

export async function deleteUser(id: number) {
  await prismaClient.user.delete({
    where: { id },
  });
}
