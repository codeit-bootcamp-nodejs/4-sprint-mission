import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "상품 이름을 입력하세요" }),
  price: z.number().gte(0),
});
