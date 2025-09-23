import prisma from '@config/prisma.js';
import { NotFoundError } from '@utils/app-error.js';

interface UserResult {
  email: string;
  nickname: string;
  createdAt: Date;
  image: string | null;
}

export async function getUserService(userId: number): Promise<UserResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, nickname: true, createdAt: true, image: true },
  });

  if (!user) {
    throw new NotFoundError('유저를 찾을 수 없습니다.');
  }

  return user;
}
