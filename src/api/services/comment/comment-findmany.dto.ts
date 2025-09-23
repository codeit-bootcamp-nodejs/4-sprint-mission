import type { ParsedQs } from "qs";

export interface FindManyCommentsQuery {
  productId?: number;
  articleId?: number;
  cursor?: string;
  limit?: number;
}

export class FindManyCommentsQueryDto {
  public static from(query: ParsedQs): FindManyCommentsQuery {
    const { productId, articleId, cursor, limit } = query;
    const params: FindManyCommentsQuery = {};

    if (productId) params.productId = Number(productId);
    if (articleId) params.articleId = Number(articleId);
    if (typeof cursor === "string") params.cursor = cursor;
    if (limit) params.limit = Number(limit);

    return params;
  }
}
