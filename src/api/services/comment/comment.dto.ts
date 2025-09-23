import { IsString, MinLength, MaxLength, IsOptional, IsNumber } from "class-validator";

// 댓글 생성용 DTO
export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: "댓글 내용은 최소 1자 이상이어야 합니다." })
  @MaxLength(500, { message: "댓글 내용은 최대 500자 이하여야 합니다." })
  content: string;

  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsNumber()
  @IsOptional()
  articleId?: number;

  public static from(data: { [key: string]: any }): CreateCommentDto {
    const dto = new CreateCommentDto();
    dto.content = data.content;
    dto.productId = data.productId;
    dto.articleId = data.articleId;
    return dto;
  }
}

// 댓글 수정용 DTO
export class UpdateCommentDto {
  @IsString()
  @MinLength(1, { message: "댓글 내용은 최소 1자 이상이어야 합니다." })
  @MaxLength(500, { message: "댓글 내용은 최대 500자 이하여야 합니다." })
  content: string;

  public static from(data: { [key: string]: any }): UpdateCommentDto {
    const dto = new UpdateCommentDto();
    dto.content = data.content;
    return dto;
  }
}
