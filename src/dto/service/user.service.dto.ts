export interface GetUserByIdDto {
  userId: number;
}

export interface UpdateProfileDto {
  nickname?: string;
  image?: string;
  userId: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  userId: number;
}

export interface DeleteUserByIdDto {
  userId: number;
}

export interface GetUserProductsDto {
  userId: number;
}

export interface GetLikedProductsDto {
  userId: number;
}

export interface GetLikedArticlesDto {
  userId: number;
}
