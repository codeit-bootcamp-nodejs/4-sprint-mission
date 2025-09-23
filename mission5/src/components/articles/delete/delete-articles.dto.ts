import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class DeleteArticleDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  articleId!: number;
}
