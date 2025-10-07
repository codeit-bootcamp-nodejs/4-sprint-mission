/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = 'test',
    updated_at = now()
WHERE user_id = 1;


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM products AS p
WHERE p.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;  -- (page 3) 10 * (3-1)


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM products
WHERE user_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM product_like pl
JOIN products p ON p.product_id = pl.product_id
WHERE pl.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_liked
FROM product_like
WHERE user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (user_id, product_name, product_description, price, created_at, updated_at)
VALUES (1, '새 상품명', '설명입니다', 19999.00, now(), now())
RETURNING *;


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p.*,
  COALESCE(l.like_count, 0) AS like_count
FROM products p
LEFT JOIN (
  SELECT product_id, COUNT(*)::int AS like_count
  FROM product_like
  GROUP BY product_id
) l ON l.product_id = p.product_id
WHERE p.product_name ILIKE '%test%'
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT
  p.*,
  (SELECT COUNT(*)::int FROM product_like WHERE product_id = 1) AS like_count
FROM products p
WHERE p.product_id = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
SET product_name = '수정된 상품명',
    product_description = '수정된 설명',
    price = 25000.00,
    updated_at = now()
WHERE product_id = 1
RETURNING *;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE product_id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_like (user_id, product_id, created_at)
VALUES (1, 2, now())
ON CONFLICT (user_id, product_id) DO NOTHING;  -- 중복 좋아요 방지 (UNIQUE 제약 가정)


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_like
WHERE user_id = 1
  AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments (user_id, product_id, post_id, content, created_at, updated_at)
VALUES (1, 2, NULL, '상품이 정말 맘에 들어요!', now(), now())
RETURNING *;  -- CHECK: exactly one of (post_id, product_id)


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT c.*
FROM comments c
WHERE c.product_id = 1
  AND c.created_at < DATE '2025-03-25'
ORDER BY c.created_at DESC
LIMIT 10;
