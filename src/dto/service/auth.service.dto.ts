export interface CheckUserExistsDto {
  email: string;
  nickname: string;
}

export interface CreateUserDto {
  email: string;
  nickname: string;
  password: string;
}
