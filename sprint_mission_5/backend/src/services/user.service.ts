import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/index.js';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  UserResponseDto,
  UserWithTokenDto,
} from '../dto/index.js';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(userData: CreateUserDto): Promise<UserWithTokenDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginData: LoginUserDto): Promise<UserWithTokenDto> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('존재하지 않는 이메일입니다.');
    }

    const isValidPassword = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async getUserById(id: number): Promise<UserResponseDto | null> {
    return await this.userRepository.findById(id);
  }

  async updateUser(
    id: number,
    userData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await this.userRepository.update(id, userData);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env['JWT_REFRESH_SECRET']!,
      ) as {
        userId: number;
      };

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id },
        process.env['JWT_SECRET']!,
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  private generateTokens(userId: number): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(
      { userId },
      process.env['JWT_SECRET']!,
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env['JWT_REFRESH_SECRET']!,
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as {
        userId: number;
      };
      return decoded;
    } catch (error) {
      throw new Error('유효하지 않은 액세스 토큰입니다.');
    }
  }

  async getMyProducts(userId: number) {
    // ProductRepository를 사용하여 사용자의 상품 조회
    const { serviceContainer } = await import('./service.container.js');
    const productRepository = serviceContainer.getProductRepository();
    return await productRepository.findByUserId(userId);
  }

  async getMyLikedProducts(userId: number) {
    // ProductRepository를 사용하여 사용자가 좋아요한 상품 조회
    const { serviceContainer } = await import('./service.container.js');
    const productRepository = serviceContainer.getProductRepository();
    return await productRepository.findLikedByUserId(userId);
  }

  async getMyArticles(userId: number) {
    // ArticleRepository를 사용하여 사용자의 게시글 조회
    const { serviceContainer } = await import('./service.container.js');
    const articleRepository = serviceContainer.getArticleRepository();
    return await articleRepository.findByUserId(userId);
  }
}
