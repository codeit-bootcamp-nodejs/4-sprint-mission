import { IsString, IsNotEmpty, IsNumber, IsPositive, IsArray } from "class-validator";

export class ProductDto {
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목을 입력하세요." })
  name: string;

  @IsNumber({}, { message: "상품 가격은 숫자여야 합니다." })
  @IsPositive({ message: "상품 가격은 0보다 커야 합니다." })
  price: number;

  @IsArray({ message: "태그는 배열이어야 합니다." })
  @IsString({ each: true, message: "각 태그는 문자열이어야 합니다." })
  tags: string[];

  // DTO 생성 메서드
  public static from(data: { [key: string]: any }): ProductDto {
    const dto = new ProductDto();

    dto.name = data.name;
    dto.price = data.price;
    dto.tags = data.tags;

    return dto;
  }
}
