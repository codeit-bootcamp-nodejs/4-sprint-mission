import { UsersRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

export class UsersService {
  usersRepository = new UsersRepository();

  signUp = async (email: string, password: string, nickname: string) => {
    const isExistUser = await this.usersRepository.findUserByEmailOrNickname(email, nickname);
    if (isExistUser) {
      const err = new Error("이미 사용중인 이메일 또는 닉네임 입니다.");
      err.name = "ConflictError"; // Custom error name to be caught in controller
      throw err;
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

  signIn = async (email: string, password: string) => {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      const err = new Error("인증 정보가 유효하지 않습니다.");
      err.name = "UnauthorizedError";
      throw err;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      const err = new Error("인증 정보가 유효하지 않습니다.");
      err.name = "UnauthorizedError";
      throw err;
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
    if (!accessTokenSecret || !refreshTokenSecret) {
      const err = new Error("서버에 토큰 시크릿 키가 설정되지 않았습니다.");
      err.name = "ServerError";
      throw err;
    }

    const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
      expiresIn: "7d",
    });

    await this.usersRepository.createRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  };

  updateMe = async (userId: number, nickname: string | undefined, image: string | undefined) => {
    if (nickname) {
      const isExistNickname = await this.usersRepository.findOtherUserByNickname(nickname, userId);
      if (isExistNickname) {
        const err = new Error("이미 사용중인 닉네임입니다.");
        err.name = "ConflictError";
        throw err;
      }
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};
    if (nickname) dataToUpdate.nickname = nickname;
    if (image) dataToUpdate.image = image;

    const updatedUser = await this.usersRepository.updateUser(userId, dataToUpdate);

    return updatedUser;
  };

  updatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      // This should not happen if the user is authenticated, but as a safeguard
      const err = new Error("사용자 정보를 찾을 수 없습니다.");
      err.name = "NotFoundError";
      throw err;
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
      const err = new Error("현재 비밀번호가 일치하지 않습니다.");
      err.name = "UnauthorizedError";
      throw err;
    }

    if (currentPassword === newPassword) {
      const err = new Error("새로운 비밀번호와 현재 비밀번호가 같습니다.");
      err.name = "BadRequestError";
      throw err;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await this.usersRepository.updateUserPassword(userId, hashedNewPassword);
    await this.usersRepository.deleteRefreshTokensByUserId(userId);
  };

  refreshToken = async (token: string) => {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!refreshTokenSecret || !accessTokenSecret) {
      const err = new Error("서버에 토큰 시크릿 키가 설정되지 않았습니다.");
      err.name = "ServerError";
      throw err;
    }

    try {
      const decodedToken = jwt.verify(token, refreshTokenSecret);
      if (typeof decodedToken !== 'object' || decodedToken === null || !('userId' in decodedToken)) {
        const err = new Error("유효하지 않은 Refresh Token입니다.");
        err.name = "UnauthorizedError";
        throw err;
      }

      const storedToken = await this.usersRepository.findRefreshToken(token);
      if (!storedToken) {
        const err = new Error("유효하지 않은 Refresh Token입니다.");
        err.name = "UnauthorizedError";
        throw err;
      }

      const user = storedToken.user;
      if (!user) {
        const err = new Error("토큰에 해당하는 사용자를 찾을 수 없습니다.");
        err.name = "UnauthorizedError";
        throw err;
      }

      const newAccessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
        expiresIn: "1h",
      });

      return { accessToken: newAccessToken };
    } catch (err: any) {
        // JWT-related errors (expired, invalid) should be treated as unauthorized.
        const unauthorizedErr = new Error("Refresh Token이 유효하지 않습니다.");
        unauthorizedErr.name = "UnauthorizedError";
        throw unauthorizedErr;
    }
  };

  updateProfileImage = async (userId: number, imageUrl: string) => {
    const updatedUser = await this.usersRepository.updateUser(userId, { image: imageUrl });
    return updatedUser;
  };
}
