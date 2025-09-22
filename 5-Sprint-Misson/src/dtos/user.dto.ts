// 내 정보 수정 DTO
export interface UpdateProfileDto {
  nickname?: string;
  image?: string;
}

// 비밀번호 변경 DTO
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// 페이지네이션 쿼리 DTO
export interface PaginationQueryDto {
  page?: number;
  pageSize?: number;
}
