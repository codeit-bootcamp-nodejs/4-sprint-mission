import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

// URL Params DTO
export class CreateCommentParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  articleId?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  productId?: number;
}

// Body DTO
export class CreateCommentBodyDto {
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content!: string;
}

// Service용 DTO
export interface CreateCommentDto {
  content: string;
  authorId: number;
  articleId: number | null;
  productId: number | null;
}
