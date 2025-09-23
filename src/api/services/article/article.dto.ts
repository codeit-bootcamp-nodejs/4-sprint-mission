import { IsString, IsNotEmpty } from "class-validator";

export class ArticleDto {
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목을 입력하세요." })
  title: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용을 입력하세요." })
  content: string;

  // DTO 생성 메서드
  public static from(data: { [key: string]: any }): ArticleDto {
    const dto = new ArticleDto();

    dto.title = data.title;
    dto.content = data.content;

    return dto;
  }
}
