import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsersRepository } from './users.repository';
import { RegisterDto, LoginDto, UpdateUserDto, UserResponseDto, AuthResponseDto } from './users.dto';
import { env } from '../../shared/config/env';

export class UsersService {
  constructor(private repository: UsersRepository) {}

  async register(userData: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.repository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Store refresh token
    await this.repository.updateRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    // Find user with password
    const user = await this.repository.findByEmailWithPassword(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Store refresh token
    await this.repository.updateRefreshToken(user.id, refreshToken);

    // Return user without password and refreshToken
    const { password, refreshToken: _, ...userResponse } = user;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async getUser(id: number): Promise<UserResponseDto | null> {
    return await this.repository.findById(id);
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    const updateData: UpdateUserDto & { password?: string } = { ...userData };

    // Hash password if provided
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    return await this.repository.update(id, updateData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: number };

      // Find user by refresh token
      const user = await this.repository.findByRefreshToken(refreshToken);
      if (!user || user.id !== decoded.userId) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);

      // Update refresh token in database
      await this.repository.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateAccessToken(userId: number): string {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(userId: number): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }
}
