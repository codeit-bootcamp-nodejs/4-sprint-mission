import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import type { CreateUserDTO, UserInfoDTO, GetUserDTO } from "../types/user.js";

export async function createUser(user: CreateUserDTO) {
  const hashedPassword = await hashPassword(user.password);

  const createdUser = await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword, // This line overwrites user.password
    },
  });

  return createdUser;
}

export async function findByEmail(email: string) {
  const result = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return result;
}

export async function findById(id: number) {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export function filterSensitiveUserData(user: UserInfoDTO) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export async function updateUser(id: number, toUpdate: any) {
  if (toUpdate.password) {
    toUpdate.password = await hashPassword(toUpdate.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: toUpdate,
  });

  return updatedUser;
}
