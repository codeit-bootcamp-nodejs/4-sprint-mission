import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

// URL Params DTO
export class UpdateCommentParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  commentId!: number;
}

// Body DTO
export class UpdateCommentBodyDto {
  @IsNotEmpty({ message: '댓글 내용은 필수입니다.' })
  content!: string;
}

// Service용 DTO
export interface UpdateCommentDto {
  commentId: number;
  userId: number;
  content: string;
}
