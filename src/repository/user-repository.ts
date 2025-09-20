import { Prisma, PrismaClient } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  findUserByEmail = async (email: string) => {
    return await this.prisma.user.findUnique({ where: { email } });
  };

  findUserById = async (userId: number) => {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  };

  // hashedPassword의 타입을 string으로 명시적으로 지정
  createUser = async (
    email: string,
    nickname: string,
    hashedPassword: string,
  ) => {
    return await this.prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
  };

  updateUser = async (userId: number, dataToUpdate: Prisma.UserUpdateInput) => {
    return await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
  };

  findLikedProductsByUserId = async (userId: number) => {
    const userWithLikes = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        productLikes: {
          orderBy: { product: { createdAt: 'desc' } },
          select: {
            product: {
              select: { id: true, name: true, price: true, createdAt: true },
            },
          },
        },
      },
    });
    return userWithLikes!.productLikes.map((like) => like.product);
  };

  findLikedArticlesByUserId = async (userId: number) => {
    const userWithLikes = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        articleLikes: {
          orderBy: { article: { createdAt: 'desc' } },
          select: {
            article: {
              select: { id: true, title: true, content: true, createdAt: true },
            },
          },
        },
      },
    });
    return userWithLikes!.articleLikes.map((like) => like.article);
  };
}