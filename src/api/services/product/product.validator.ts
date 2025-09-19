import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "상품 이름을 입력하세요"),
  price: z.number().positive("상품 가격은 0보다 커야 합니다."),
  tags: z.array(z.string(), "태그는 문자열 배열이어야 합니다"),
});
