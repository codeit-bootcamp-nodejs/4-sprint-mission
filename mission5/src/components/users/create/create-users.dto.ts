import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  nickname!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsUrl()
  image?: string | null; 

  @IsString()
  @Length(8, 255)
  password!: string;
}
