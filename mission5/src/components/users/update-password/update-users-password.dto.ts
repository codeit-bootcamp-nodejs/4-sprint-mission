import { IsString, Length } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @Length(8, 255, { message: '현재 비밀번호를 입력하세요.' })
  currentPassword!: string;

  @IsString()
  @Length(8, 255, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
  newPassword!: string;
}
