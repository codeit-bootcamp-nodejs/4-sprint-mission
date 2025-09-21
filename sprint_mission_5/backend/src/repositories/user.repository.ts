import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/index.js';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.create({
      data,
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

  async findById(id: number): Promise<UserResponseDto | null> {
    return await this.prisma.user.findUnique({
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
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.update({
      where: { id },
      data,
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

  async updateRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
