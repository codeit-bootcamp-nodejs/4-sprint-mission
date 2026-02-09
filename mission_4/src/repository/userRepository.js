import e from "express";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";

export async function createUser(user) {
  const hashedPassword = await hashPassword(user.password);

  const createdUser = await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword, // This line overwrites user.password
    },
  });

  return createdUser;
}

export async function findByEmail(email) {
  const result = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return result;
}

export async function findById(id) {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export async function updateUser(id, toUpdate) {
  if (toUpdate.password) {
    toUpdate.password = await hashPassword(toUpdate.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: toUpdate,
  });

  return updatedUser;
}
