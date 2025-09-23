import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// URL Params DTO
export class UpdateProductParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId!: number;
}

// Body DTO
export class UpdateProductBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  tags?: string[];
}

// Service용 DTO
export interface UpdateProductDto {
  productId: number;
  userId: number;
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}
