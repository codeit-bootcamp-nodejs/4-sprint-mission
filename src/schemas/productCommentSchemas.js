import { safeString, intSafe, strictObject } from "../lib/zsec.js";

const productCommentSchemas = {
  body: strictObject({
    content: safeString({
      min: 1,
      max: 500, // 댓글 길이 제한 (서비스 정책에 맞게)
      label: "content",
      trim: true,
    }),
  }),

  query: strictObject({
    cursor: intSafe(1, Number.MAX_SAFE_INTEGER).default(1), // 안전한 정수, 기본값 1
    limit: intSafe(1, 20).default(10), // 보수적으로 페이지 크기 제한 (최대 20)
  }),

  params: strictObject({
    commentId: intSafe(1, Number.MAX_SAFE_INTEGER).optional(),
    productId: intSafe(1, Number.MAX_SAFE_INTEGER),
  }),
};

export default productCommentSchemas;
