import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export interface UpdateArticleDto {
  articleId: number;
  userId: number;
  title: string;
  content: string;
}

export class UpdateArticleParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  articleId!: number;
}

export class UpdateArticleBodyDto {
  @IsString()
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: '내용은 필수입니다.' })
  content!: string;
}
