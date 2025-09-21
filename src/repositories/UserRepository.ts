import prisma from '../index';
import { User as PrismaUser, Prisma, Product } from '@prisma/client';

class UserRepository {
  async findUserById(id: number): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return prisma.user.create({ data });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<PrismaUser> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<PrismaUser> {
    return prisma.user.delete({ where: { id } });
  }

  async findProductsByUserId(userId: number): Promise<Product[] | null> {
    const userWithProducts = await prisma.user.findUnique({
      where: { id: userId },
      include: { products: true },
    });
    return userWithProducts ? userWithProducts.products : null;
  }
}

export default UserRepository;
