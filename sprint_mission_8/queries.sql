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
SET nickname = 'test'
WHERE id = 1;


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/ 
SELECT *
FROM products
WHERE seller_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM products
WHERE seller_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM products p
JOIN product_likes pl ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY pl.created_at DESC
LIMIT 10 OFFSET 20;
-- PK(user_id, product_id) 를 사용하여 좋아요 중복을 방지

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM product_likes
WHERE user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (seller_id, category_id, name, description, price, condition, status)
VALUES (1, 1, 'iPhone 15 Pro', '거의 새것이나 다름없는 상태입니다', 1200000, 'LIKE_NEW', 'FOR_SALE');
RETURNING id;
-- categories.id = 1 이 존재한다고 가정했을때
-- RETURNING id 를 통해 생성된 상품의 id를 반환

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, p.like_count
FROM products p
WHERE LOWER(p.name) LIKE '%' || LOWER('test') || '%'
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT *
FROM products
WHERE id = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
SET name = 'iPhone 15 Pro Max',
    price = 1500000,
    description = '상태 최상급',
    updated_at = NOW()
WHERE id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;
-- status 삭제로 soft delete로도 구현가능
-- 현상태는 products를 삭제함으로써 CASCADE로 연관된 images/likes/comments도 삭제됨

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (user_id, product_id)
VALUES (1, 2);
ON CONFLICT (user_id, product_id) DO NOTHING;
-- PK(user_id, product_id) 를 사용하여 좋아요 중복을 방지

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_likes
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_comments (product_id, user_id, content)
VALUES (2, 1, '이 상품 상태가 정말 좋네요!');
RETURNING id;
-- RETURNING id 를 통해 생성된 댓글의 id를 반환

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT *
FROM product_comments
WHERE product_id = 1
  AND created_at < TIMESTAMPTZ '2025-03-25 00:00:00+09'
ORDER BY created_at DESC
LIMIT 10;


/*
  15. 알림 목록 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
*/
SELECT *
FROM notifications
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;


/*
  16. 안 읽은 알림 개수 조회
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = 1 AND is_read = FALSE;


/*
  17. 알림 읽음 처리
  - 1번 알림을 읽음 처리
*/
UPDATE notifications
SET is_read = TRUE,
    read_at = NOW()
WHERE id = 1;


/*
  18. 모든 알림 읽음 처리
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE notifications
SET is_read = TRUE,
    read_at = NOW()
WHERE user_id = 1 AND is_read = FALSE;