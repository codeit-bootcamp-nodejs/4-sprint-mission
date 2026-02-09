export interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface GetUserDTO {
  email: string;
  password: string;
}

export interface UserInfoDTO {
  password?: string;
  email: string;
  nickname: string;
  image: string | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  id: number;
}
