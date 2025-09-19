import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  email: string;

  @MinLength(8, { message: "비밀번호는 최소 8자 이상이어야합니다." })
  password: string;

  @MinLength(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
  nickname: string;

  public static from(data: { [key: string]: any }): SignupDto {
    const dto = new SignupDto();
    dto.email = data.email;
    dto.password = data.password;
    dto.nickname = data.nickname;
    return dto;
  }
}

export class LoginDto {
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  email: string;

  @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
  password: string;

  public static from(data: { [key: string]: any }): LoginDto {
    const dto = new LoginDto();
    dto.email = data.email;
    dto.password = data.password;
    return dto;
  }
}
