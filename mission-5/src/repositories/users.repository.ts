import type {
  DeleteDTO,
  FindByIdDTO,
  findManyContentDTO,
  findManyLikeContentDTO,
  UpdateDTO,
} from '@/dto/users.dto.js';
import type { UserWithContent } from '../types/user.types.js';
import type { PrismaClient } from '@prisma/client';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById({ userId }: FindByIdDTO) {
    return await this.prisma.user.findUniqueOrThrow({
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
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }

  async update({ userId, updateData }: UpdateDTO) {
    return await this.prisma.user.update({
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
    return await this.prisma.user.delete({
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
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      ...options,
    });
  }
  async findManyLikeContent({ userId, singularContentType }: findManyLikeContentDTO) {
    return await this.prisma.user.findUniqueOrThrow({
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
