import { safeString, intSafe, strictObject } from "../lib/zsec.js";

const articleCommentSchemas = {
  body: strictObject({
    content: safeString({
      min: 1,
      max: 500, // 댓글은 최대 500자까지만 허용
      label: "content",
      forbid: /[<>]/, // XSS 방어: 태그 직접 입력 차단
      trim: true,
    }),
  }),

  query: strictObject({
    cursor: intSafe(1, 10_000).default(1), // 최대 1만 페이지까지
    limit: intSafe(1, 10).default(10), // 한번에 최대 20개까지만 조회
  }),

  params: strictObject({
    commentId: intSafe(1, Number.MAX_SAFE_INTEGER).optional(),
    articleId: intSafe(1, Number.MAX_SAFE_INTEGER),
  }),
};

export default articleCommentSchemas;
