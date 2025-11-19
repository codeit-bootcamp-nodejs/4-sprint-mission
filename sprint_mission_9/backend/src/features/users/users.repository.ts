import { PrismaClient } from '@prisma/client';
import { RegisterDto, UpdateUserDto, UserResponseDto } from './users.dto';

export class UsersRepository {
  constructor(private prisma: PrismaClient) {}

  private readonly selectFields = {
    id: true,
    email: true,
    nickname: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    password: false,
    refreshToken: false,
  };

  async create(userData: RegisterDto & { password: string }): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        nickname: userData.nickname,
        password: userData.password,
      },
      select: this.selectFields,
    });
    return user;
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.selectFields,
    });
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.selectFields,
    });
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<{
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    password: string;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: number, userData: UpdateUserDto & { password?: string }): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
      select: this.selectFields,
    });
    return user;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<{
    id: number;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
      select: this.selectFields,
    });
    return user;
  }
}
