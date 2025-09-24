export interface UpdateProfileBodyDto {
  nickname?: string;
  image?: string;
}

export interface ChangePasswordBodyDto {
  currentPassword: string;
  newPassword: string;
}
