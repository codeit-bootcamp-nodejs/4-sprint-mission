/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE Users
SET nickname = 'test'
WHERE id = 1
RETURNING id, email, nickname, created_at;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM Products
WHERE seller_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS my_products_count
FROM Products
WHERE seller_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*, pl.created_at AS liked_at
FROM ProductLikes pl
JOIN Products p ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY pl.created_at DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS liked_products_count
FROM ProductLikes
WHERE user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO Products (seller_id, name, description, price, condition, is_hot, created_at)
VALUES (
  1,
  'Test Product #1',
  'This is a sample product created for testing.',
  49000,
  'used',
  false,
  NOW()
)
RETURNING id, seller_id, name, price, condition, is_hot, created_at;


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p.*,
  COALESCE(pl.likes_count, 0) AS likes_count
FROM Products p
LEFT JOIN (
  SELECT product_id, COUNT(*) AS likes_count
  FROM ProductLikes
  GROUP BY product_id
) pl ON pl.product_id = p.id
WHERE p.name ILIKE '%test%'
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT
  p.id,
  p.seller_id,
  p.name,
  p.description,
  p.price,
  p.condition,
  p.is_hot,
  p.created_at,
  COALESCE(lc.likes_count, 0) AS likes_count,
  COALESCE(array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), ARRAY[]::text[]) AS images
FROM Products p
LEFT JOIN ProductImages pi ON pi.product_id = p.id
LEFT JOIN (
  SELECT product_id, COUNT(*) AS likes_count
  FROM ProductLikes
  GROUP BY product_id
) lc ON lc.product_id = p.id
WHERE p.id = 1
GROUP BY p.id, lc.likes_count;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE Products
SET
  name = 'Updated Product Name',
  description = 'Updated description for product 1.',
  price = 55000,
  condition = 'like new',
  is_hot = TRUE
WHERE id = 1
RETURNING id, name, price, condition, is_hot, updated_at := NOW();


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM Products
WHERE id = 1
RETURNING id, seller_id, name;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO ProductLikes (user_id, product_id, created_at)
VALUES (1, 2, NOW())
ON CONFLICT (user_id, product_id) DO NOTHING
RETURNING user_id, product_id, created_at;


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM ProductLikes
WHERE user_id = 1 AND product_id = 2
RETURNING user_id, product_id;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO ProductComments (product_id, user_id, content, created_at)
VALUES (2, 1, '이 상품 상태 좋아보이네요! 문의드립니다.', NOW())
RETURNING id, product_id, user_id, content, created_at;


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT id, product_id, user_id, content, created_at
FROM ProductComments
WHERE product_id = 1
  AND created_at < TIMESTAMP '2025-03-25'
ORDER BY created_at DESC
LIMIT 10;
