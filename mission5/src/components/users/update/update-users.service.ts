import prisma from '@config/prisma.js';

export const updateUserService = async (userId: number, data: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    (err as any).statusCode = 404;
    throw err;
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        nickname: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  } catch (err: any) {
    if (err.code === 'P2002') {
      const duplicateErr = new Error(`Duplicate field: ${err.meta?.target}`);
      (duplicateErr as any).statusCode = 400;
      throw duplicateErr;
    }

    err.statusCode = err.statusCode ?? 500;
    throw err;
  }
};
