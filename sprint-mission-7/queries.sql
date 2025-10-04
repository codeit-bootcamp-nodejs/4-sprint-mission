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
SET username = 'test'
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
SELECT COUNT(*) AS total_products
FROM products
WHERE seller_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT
  p.id,
  p.title,
  p.price,
  p.status,
  p.created_at
FROM products AS p
INNER JOIN product_likes AS pl ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_liked_products
FROM product_likes
WHERE user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (title, content, price, location, seller_id, category_id)
VALUES ('새로운 닌텐도 스위치 판매', '미개봉 새 상품입니다. 직거래 원해요.', 350000, '서울시 강남구', 1, 1);
-- 참고: category_id 1번이 '디지털기기'라고 가정


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p.id,
  p.title,
  p.price,
  p.location,
  p.created_at,
  COUNT(pl.product_id) AS like_count
FROM products AS p
LEFT JOIN product_likes AS pl ON p.id = pl.product_id
WHERE p.title LIKE '%test%'
GROUP BY p.id
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
SET
  title = '수정된 상품 제목',
  content = '내용도 일부 수정합니다.',
  price = 330000
WHERE id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;
-- 참고: ON DELETE CASCADE 설정으로 인해 관련된 product_images, product_tags, product_comments, product_likes 등도 함께 삭제됩니다.


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
-- 만약 이미 좋아요를 눌렀을 경우 중복 에러가 발생할 수 있으므로, 실제 애플리케이션에서는 INSERT IGNORE를 사용하거나,
-- INSERT 전에 해당 데이터가 존재하는지 확인하는 로직이 필요합니다.
INSERT INTO product_likes (user_id, product_id)
VALUES (1, 2);


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
VALUES (2, 1, '이 상품 구매 가능한가요?');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT *
FROM product_comments
WHERE product_id = 1 AND created_at < '2025-03-25 00:00:00'
ORDER BY created_at DESC
LIMIT 10;