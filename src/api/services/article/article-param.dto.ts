import { IsNumberString } from "class-validator";

export class ArticleIdParamDto {
  @IsNumberString({}, { message: "게시글 ID는 숫자 형태여야 합니다." })
  id: string;

  public static from(data: { [key: string]: any }): ArticleIdParamDto {
    const dto = new ArticleIdParamDto();
    dto.id = data.id;
    return dto;
  }
}
