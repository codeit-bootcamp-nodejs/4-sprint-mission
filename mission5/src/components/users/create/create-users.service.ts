import prisma from '@config/prisma.js';
import bcrypt from 'bcrypt';

export async function createUserService(
  email: string,
  nickname: string,
  password: string,
  image: string | null,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
      image,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      createdAt: true,
      image: true,
    },
  });
}
