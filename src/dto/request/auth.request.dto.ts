export interface RegisterBodyDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginBodyDto {
  nickname: string;
  password: string;
}
