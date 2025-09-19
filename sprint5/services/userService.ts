import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

interface UpdateUserData {
  email?: string;
  nickname?: string;
  image?: string;
}

interface UserProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: Date;
}

interface UserProductWithLike extends UserProduct {
  isLiked: boolean;
}

export const findUser = async (id: number): Promise<Express.User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (
  id: number,
  data: UpdateUserData
): Promise<Express.User> => {
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

export const updatePassword = async (
  id: number,
  password: string
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      const error: HttpError = new Error("사용자를 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      const error: HttpError = new Error("현재 비밀번호와 동일합니다.");
      error.status = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

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

export const findUserProduct = async (id: number): Promise<UserProduct[]> => {
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

export async function findLikedProducts(
  userId: number
): Promise<UserProductWithLike[]> {
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
