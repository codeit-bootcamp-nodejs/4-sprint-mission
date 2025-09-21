// 사용자 생성 요청 DTO
export interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

// 사용자 수정 요청 DTO
export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}

// 사용자 응답 DTO
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 사용자 목록 응답 DTO
export interface UsersResponseDto {
  users: UserResponseDto[];
  total: number;
  page?: number;
  limit?: number;
}