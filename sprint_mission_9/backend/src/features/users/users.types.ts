export interface User {
  id: number;
  email: string;
  password_hash: string;
  nickname: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  created_at: Date;
}

export interface RegisterDto {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
