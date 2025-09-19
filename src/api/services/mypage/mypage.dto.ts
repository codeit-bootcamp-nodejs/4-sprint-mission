import { IsString, MinLength, IsUrl, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsOptional()
  @MinLength(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
  nickname?: string;

  @IsOptional()
  @IsUrl({}, { message: "유효한 URL 형식이 아닙니다." })
  image?: string;

  public static from(data: { [key: string]: any }): UpdateUserDto {
    const dto = new UpdateUserDto();
    dto.nickname = data.nickname;
    dto.image = data.image;
    return dto;
  }
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(1, { message: "기존 비밀번호를 입력해주세요." })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: "새로운 비밀번호는 최소 8자 이상이어야합니다." })
  newPassword: string;

  public static from(data: { [key: string]: any }): UpdatePasswordDto {
    const dto = new UpdatePasswordDto();
    dto.oldPassword = data.oldPassword;
    dto.newPassword = data.newPassword;
    return dto;
  }
}
