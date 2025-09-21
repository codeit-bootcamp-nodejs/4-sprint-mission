export interface CreateUserDto {
  email: string;
  nickname: string;
  password: string;
  image?: string;
}

export interface UpdateUserDto {
  email?: string;
  nickname?: string;
  password?: string;
  image?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithTokenDto extends UserResponseDto {
  accessToken: string;
  refreshToken: string;
}