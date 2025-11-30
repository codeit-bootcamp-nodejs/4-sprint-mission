import { UsersRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { SignUpDto, SignInDto, UpdateUserDto, UpdatePasswordDto } from '../dtos/user.dto.js';
import {
  ConflictError,
  UnauthorizedError,
  ServerError,
  NotFoundError,
  BadRequestError,
} from '../errors/http-error.js';

export class UsersService {
  usersRepository = new UsersRepository();

  signUp = async (signUpDto: SignUpDto) => {
    const { email, password, nickname } = signUpDto;
    const isExistUser = await this.usersRepository.findUserByEmailOrNickname(
      email,
      nickname,
    );
    if (isExistUser) {
      throw new ConflictError('이미 사용중인 이메일 또는 닉네임 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  };

  signIn = async (signInDto: SignInDto) => {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('인증 정보가 유효하지 않습니다.');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedError('인증 정보가 유효하지 않습니다.');
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET_KEY!, {
      expiresIn: '7d',
    });

    await this.usersRepository.createRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  };

  updateMe = async (userId: number, updateUserDto: UpdateUserDto) => {
    const { nickname, image } = updateUserDto;
    if (nickname) {
      const isExistNickname =
        await this.usersRepository.findOtherUserByNickname(nickname, userId);
      if (isExistNickname) {
        throw new ConflictError('이미 사용중인 닉네임입니다.');
      }
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};
    if (nickname) dataToUpdate.nickname = nickname;
    if (image) dataToUpdate.image = image;

    const updatedUser = await this.usersRepository.updateUser(
      userId,
      dataToUpdate,
    );

    return updatedUser;
  };

  updatePassword = async (
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ) => {
    const { currentPassword, newPassword } = updatePasswordDto;
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('사용자 정보를 찾을 수 없습니다.');
    }

    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError('새로운 비밀번호와 현재 비밀번호가 같습니다.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.updateUserPassword(userId, hashedNewPassword);
    await this.usersRepository.deleteRefreshTokensByUserId(userId);
  };

  refreshToken = async (token: string) => {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY!);
      if (
        typeof decodedToken !== 'object' ||
        decodedToken === null ||
        !('userId' in decodedToken)
      ) {
        throw new UnauthorizedError('유효하지 않은 Refresh Token입니다.');
      }

      const storedToken = await this.usersRepository.findRefreshToken(token);
      if (!storedToken) {
        throw new UnauthorizedError('유효하지 않은 Refresh Token입니다.');
      }

      const user = storedToken.user;
      if (!user) {
        throw new UnauthorizedError('토큰에 해당하는 사용자를 찾을 수 없습니다.');
      }

      const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: '1h',
      });

      return { accessToken: newAccessToken };
    } catch (err: any) {
      throw new UnauthorizedError('Refresh Token이 유효하지 않습니다.');
    }
  };

  updateProfileImage = async (userId: number, imageUrl: string) => {
    const updatedUser = await this.usersRepository.updateUser(userId, {
      image: imageUrl,
    });
    return updatedUser;
  };
}
