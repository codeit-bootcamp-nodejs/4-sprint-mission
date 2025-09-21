export interface UserCreateDto {
  email: string;
  nickname: string;
  password: string;
}

export interface UserSignInDto {
  email: string;
  password: string;
}

export interface UserUpdateDto {
  nickname?: string;
  image?: string;
}

export interface UserChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
