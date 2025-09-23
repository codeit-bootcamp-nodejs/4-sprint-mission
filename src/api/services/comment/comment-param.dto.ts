import { IsNumberString, MinLength, MaxLength, IsOptional, IsNumber } from "class-validator";

export class CommentIdParamDto {
  @IsNumberString({}, { message: "댓글 ID는 숫자 형태여야 합니다." })
  id: string;

  public static from(data: { [key: string]: any }): CommentIdParamDto {
    const dto = new CommentIdParamDto();
    dto.id = data.id;
    return dto;
  }
}
