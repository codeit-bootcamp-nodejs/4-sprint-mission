import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  authorId!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  price!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : []))
  tags: string[] = [];
}
