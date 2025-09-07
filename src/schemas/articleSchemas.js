import { safeString, intSafe, strictObject } from "../lib/zsec.js";

const articleSchema = {
  body: strictObject({
    title: safeString({
      min: 1,
      max: 100, // 제목은 최대 100자 제한
      label: "title",
      forbid: /[<>]/, // 태그 입력 방어
      trim: true,
    }),
    content: safeString({
      min: 1,
      max: 5000, // 본문은 최대 5000자 (서비스 정책에 맞게 조정 가능)
      label: "content",
      forbid: /<script|<\/script>/i, // 스크립트 삽입 방어
      trim: true,
    }),
  }),

  query: strictObject({
    page: intSafe(1, 10_000).default(1), // 최대 1만 페이지까지
    pageSize: intSafe(1, 50).default(10), // 한번에 최대 50개까지 허용 (보수적)
    keyword: safeString({
      min: 1,
      max: 50, // 검색 키워드는 50자 제한
      label: "keyword",
      forbid: /[<>]/, // 태그 차단
      trim: true,
    })
      .array()
      .max(5) // 검색어는 최대 5개까지만
      .optional()
      .default([]),
  }),

  params: strictObject({
    id: intSafe(1, Number.MAX_SAFE_INTEGER),
  }),
};

export default articleSchema;
