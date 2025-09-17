import { safeString, intSafe, strictObject } from "../lib/zsec.js";

const productSchemas = {
  body: strictObject({
    name: safeString({
      min: 1,
      max: 100, // 상품 이름 최대 길이
      label: "상품 이름",
      trim: true,
    }),
    description: safeString({
      min: 1,
      max: 2000, // 상품 설명 최대 길이
      label: "상품 설명",
      trim: true,
    }),
    price: intSafe(0, 1_000_000_000), // 가격 0 ~ 10억
    tags: safeString({
      min: 1,
      max: 30, // 태그 개별 길이 제한
      label: "태그",
      trim: true,
      allowed: /^[a-zA-Z0-9가-힣]+$/, // 한글/영문/숫자만 허용 (특수문자/공백 차단)
    })
      .array()
      .max(20, "태그는 최대 20개까지만 입력할 수 있습니다.") // 배열 길이 제한
      .optional()
      .default([]),
  }),

  query: strictObject({
    page: intSafe(1, Number.MAX_SAFE_INTEGER).default(1),
    pageSize: intSafe(1, 20).default(10), // 보수적으로 20 이하 제한
    keyword: safeString({
      min: 1,
      max: 100,
      label: "검색어",
      trim: true,
    })
      .array()
      .optional()
      .default([]),
  }),

  params: strictObject({
    id: intSafe(1, Number.MAX_SAFE_INTEGER),
  }),
};

export default productSchemas;
