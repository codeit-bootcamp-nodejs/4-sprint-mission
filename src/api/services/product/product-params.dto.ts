import { IsNumberString } from "class-validator";

export class ProductIdParamDto {
  @IsNumberString({}, { message: "상품 ID는 숫자 형태여야 합니다." })
  id: string;

  public static from(data: { [key: string]: any }): ProductIdParamDto {
    const dto = new ProductIdParamDto();
    dto.id = data.id;
    return dto;
  }
}
