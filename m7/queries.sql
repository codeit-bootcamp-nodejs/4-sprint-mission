/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE "users"
SET "nickname" = 'test'
WHERE "id" = 1;


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM "products"
WHERE "user_id" = 1
ORDER BY "created_at" DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM "products"
WHERE "user_id" = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM "favorites" AS f
JOIN "products" AS p ON f."product_id" = p."id"
WHERE f."user_id" = 1
ORDER BY f."created_at" DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM "favorites"
WHERE "user_id" = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO "products" ("name", "description", "price", "thumbnail", "user_id")
VALUES ('테스트 상품', '테스트용 상품입니다.', 15000, 'https://example.com/thumb.jpg', 1)
RETURNING "id", "name", "created_at";


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p."id",
  p."name",
  p."price",
  p."thumbnail",
  p."created_at",
  COALESCE(fcnt.cnt, 0) AS favorite_count
FROM "products" AS p
LEFT JOIN (
  SELECT "product_id", COUNT(*) AS cnt
  FROM "favorites"
  GROUP BY "product_id"
) AS fcnt ON p."id" = fcnt."product_id"
WHERE p."name" ILIKE '%test%'
ORDER BY p."created_at" DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT
  p."id",
  p."name",
  p."description",
  p."price",
  p."thumbnail",
  p."created_at",
  p."updated_at",
  u."nickname" AS author_nickname,
  COALESCE(fcnt.cnt, 0) AS favorite_count
FROM "products" AS p
JOIN "users" AS u ON p."user_id" = u."id"
LEFT JOIN (
  SELECT "product_id", COUNT(*) AS cnt
  FROM "favorites"
  GROUP BY "product_id"
) AS fcnt ON p."id" = fcnt."product_id"
WHERE p."id" = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE "products"
SET "name" = '수정된 상품명',
    "description" = '수정된 설명입니다.',
    "price" = 20000,
    "thumbnail" = 'https://example.com/new-thumb.jpg'
WHERE "id" = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM "products"
WHERE "id" = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO "favorites" ("product_id", "user_id")
SELECT 2, 1
WHERE NOT EXISTS (
  SELECT 1 FROM "favorites" WHERE "product_id" = 2 AND "user_id" = 1
);


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM "favorites"
WHERE "product_id" = 2
  AND "user_id" = 1;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO "comments" ("content", "product_id", "user_id")
VALUES ('좋은 상품이네요!', 2, 1);


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT
  c."id",
  c."content",
  c."created_at",
  u."nickname" AS author_nickname
FROM "comments" AS c
JOIN "users" AS u ON u."id" = c."user_id"
WHERE c."product_id" = 1
  AND c."created_at" < TIMESTAMP '2025-03-25 00:00:00'
ORDER BY c."created_at" DESC
LIMIT 10;
