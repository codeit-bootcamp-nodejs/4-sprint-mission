import type { ParsedQs } from "qs";
import type { FindManyParams } from "../types/express.d.ts";

export class FindManyParamsDto {
  public static from(query: ParsedQs): FindManyParams {
    const { offset, limit, order, keyword } = query;

    const params: FindManyParams = {};

    // 값이 존재할 경우에만 객체에 속성을 추가
    if (offset) {
      params.offset = Number(offset);
    }
    if (limit) {
      params.limit = Number(limit);
    }
    if (typeof order === "string") {
      params.order = order;
    }
    if (typeof keyword === "string") {
      params.keyword = keyword;
    }
    return params;
  }
}
