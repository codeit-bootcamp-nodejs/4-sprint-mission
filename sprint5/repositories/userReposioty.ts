import prisma from "../lib/prisma.js";
import type { UserProduct, UpdateUserData } from "../types/dto.js";

export const userRepository = {
  findUser: async (id: number): Promise<Express.User | null> => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });
  },

  updateUser: async (
    id: number,
    data: UpdateUserData
  ): Promise<Express.User> => {
    const { email, nickname, image } = data;

    return await prisma.user.update({
      where: { id },
      data: {
        ...(email !== undefined && { email }),
        ...(nickname !== undefined && { nickname }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findUserWithPassword: async (id: number) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });
  },

  updatePassword: async (id: number, hashedPassword: string): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  },

  findUserProduct: async (id: number): Promise<UserProduct[]> => {
    return await prisma.product.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });
  },

  findLikedProducts: async (userId: number) => {
    return await prisma.product.findMany({
      where: {
        like: {
          some: {
            userId,
          },
        },
      },
      include: {
        user: {
          select: { id: true, nickname: true },
        },
        _count: {
          select: { like: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
