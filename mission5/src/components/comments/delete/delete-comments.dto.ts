import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class DeleteCommentDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  commentId!: number;
}
