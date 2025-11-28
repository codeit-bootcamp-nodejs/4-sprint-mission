export interface SignUpDto {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  nickname?: string;
  image?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
