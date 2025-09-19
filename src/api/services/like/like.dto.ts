import { IsIn, IsNumberString } from "class-validator";

export class ToggleLikeParamDto {
  @IsIn(["product", "article"], { message: 'type은 "product" 또는 "article"이어야 합니다.' })
  type: "product" | "article";

  @IsNumberString({}, { message: "ID는 숫자 형태여야 합니다." })
  id: string;

  public static from(data: { [key: string]: any }): ToggleLikeParamDto {
    const dto = new ToggleLikeParamDto();
    dto.type = data.type;
    dto.id = data.id;
    return dto;
  }
}
