import bcrypt from 'bcrypt';

import prisma from '@config/prisma.js';
import { AppError } from '@utils/app-error.js';

export const updateUserPasswordService = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('유저를 찾을 수 없습니다.');

  // 현재 비밀번호 검증
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new AppError('현재 비밀번호가 올바르지 않습니다.');

  // 새 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
    select: { id: true, email: true, updatedAt: true },
  });
};
