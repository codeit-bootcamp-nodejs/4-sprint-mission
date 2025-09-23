import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// 게시글 생성 입력값 검증
export class CreateArticleDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  authorId!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
