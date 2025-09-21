import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User as PrismaUser, Product, Prisma } from '@prisma/client';
import UserRepository from './repositories/UserRepository';
import { UserCreateDto, UserUpdateDto } from './dtos/UserDto';

interface UserWithoutPassword extends Omit<PrismaUser, 'password' | 'refreshToken'> {}

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // 회원가입 로직
  public signUp = async (userData: UserCreateDto): Promise<UserWithoutPassword> => {
    const { email, nickname, password } = userData;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('이미 사용중인 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const user = await this.userRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
    });

    // 사용자 정보 반환
    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  public signIn = async (
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    // 이메일로 사용자 조회
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('존재하지 않는 이메일입니다.');
    }

    // 비밀번호 확인
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // Access Token 생성 (12시간)
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '12h',
    });

    // Refresh Token 생성 (7일)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
      { expiresIn: '7d' },
    );

    // Refresh Token을 해싱해서 DB에 저장
    await this.userRepository.updateUser(user.id, {
      refreshToken: await bcrypt.hash(refreshToken, 10),
    });

    return { accessToken, refreshToken };
  };

  public getUserById = async (id: number): Promise<PrismaUser | null> => {
    return this.userRepository.findUserById(id);
  };

  public updateUser = async (id: number, data: UserUpdateDto): Promise<PrismaUser> => {
    return this.userRepository.updateUser(id, data);
  };

  public updatePassword = async (id: number, newPasswordHash: string): Promise<PrismaUser> => {
    return this.userRepository.updateUser(id, { password: newPasswordHash });
  };

  public getProductsByUserId = async (userId: number): Promise<Product[] | null> => {
    return this.userRepository.findProductsByUserId(userId);
  };
}

export default UserService;
