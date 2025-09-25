import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const findUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (id, data) => {
  try {
    const { email, nickname, image } = data;

    const updatedUser = await prisma.user.update({
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

    return updatedUser;
  } catch (err) {
    throw err;
  }
};

export const updatePassword = async (id, password) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    let hashedPassword;
    if (password !== undefined) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        const error = new Error("현재 비밀번호와 동일합니다.");
        error.status = 400;
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const findUserProduct = async (id) => {
  try {
    const userProduct = await prisma.product.findMany({
      where: { userId: id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    return userProduct;
  } catch (err) {
    throw err;
  }
};

export async function findLikedProducts(userId) {
  const products = await prisma.product.findMany({
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
  });

  return products.map((product) => ({
    ...product,
    isLiked: true,
  }));
}
