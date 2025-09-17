import prisma from '@/lib/prisma.js';
import type {
  DeleteDTO,
  FindByIdDTO,
  findManyContentDTO,
  findManyLikeContentDTO,
  UpdateDTO,
} from '@/dto/users.dto.js';
import type { UserWithContent } from '../types/user.types.js';

class UserRepository {
  async findById({ userId }: FindByIdDTO) {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
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
  }
  async findPasswordById({ userId }: FindByIdDTO) {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }

  async update({ userId, updateData }: UpdateDTO) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      data: updateData,
    });
  }

  async delete({ userId }: DeleteDTO) {
    return await prisma.user.delete({
      where: {
        id: userId,
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
  }
  async findManyContent({ userId, options }: findManyContentDTO): Promise<UserWithContent> {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      ...options,
    });
  }
  async findManyLikeContent({ userId, singularContentType }: findManyLikeContentDTO) {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        [`${singularContentType}Likes`]: {
          include: {
            [singularContentType]: true,
          },
        },
      },
    });
  }
}

export default new UserRepository();
