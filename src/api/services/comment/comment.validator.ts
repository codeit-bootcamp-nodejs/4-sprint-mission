import { z } from "zod";

export const commentSchema = z
  .object({
    content: z
      .string()
      .min(1, { message: "댓글 내용은 최소 1자 이상이어야 합니다." })
      .max(500, { message: "댓글 내용은 최대 500자 이하여야 합니다." }),
    productId: z.number().optional(),
    articleId: z.number().optional(),
  })
  .refine(
    (data) => {
      return (
        (data.productId !== undefined && data.articleId === undefined) ||
        (data.productId == undefined && data.articleId != undefined)
      );
    },
    {
      message: "productId와 articleId 중 하나만 제공되어야 합니다.",
      path: ["productId", "articleId"],
    }
  );
