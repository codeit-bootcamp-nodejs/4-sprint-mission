import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/user-repository';
import { ProductRepository } from '../repository/product-repository';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
  ) {}

  signUp = async (email, nickname, password) => {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.createUser(
      email,
      nickname,
      hashedPassword,
    );

    delete (newUser as any).password;
    return newUser;
  };

  signIn = async (email, password) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateUser(user.id, {
      currentHashedRefreshToken: hashedRefreshToken,
    });

    return { accessToken, refreshToken };
  };

  refreshToken = async (refreshToken: string) => {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;
    const userId = decoded.userId;

    const user = await this.userRepository.findUserById(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }

    const isTokenValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!isTokenValid) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      },
    );

    return newAccessToken;
  };

  signOut = async (userId: number) => {
    await this.userRepository.updateUser(userId, {
      currentHashedRefreshToken: null,
    });
  };

  getUserInfo = async (userId: number) => {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    delete (user as any).password;
    return user;
  };

  updateUserInfo = async (
    userId: number,
    userInfoData: { nickname?: string; image?: string },
  ) => {
    const { nickname, image } = userInfoData;
    const dataToUpdate: any = {};

    if (nickname) dataToUpdate.nickname = nickname;
    if (image) dataToUpdate.image = image;

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error('수정할 정보를 입력해주세요.');
    }

    const updatedUser = await this.userRepository.updateUser(
      userId,
      dataToUpdate,
    );
    delete (updatedUser as any).password;
    return updatedUser;
  };

  changePassword = async (
    userId: number,
    currentPassword,
    newPassword,
  ) => {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updateUser(userId, {
      password: hashedNewPassword,
    });
  };

  getMyProducts = async (userId: number) => {
    return await this.productRepository.findProductsByUserId(userId);
  };

  getLikedProducts = async (userId: number) => {
    return await this.userRepository.findLikedProductsByUserId(userId);
  };

  getLikedArticles = async (userId: number) => {
    return await this.userRepository.findLikedArticlesByUserId(userId);
  };
}