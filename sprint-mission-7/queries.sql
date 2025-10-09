/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = "test"
WHERE user_id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM products
WHERE user_id = 1
ORDER BY created_at DESC 
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_quantity
FROM products
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT product_name
FROM products AS p
LEFT JOIN product_like AS pl
ON pl.product_id = p.product_id
WHERE user_id = 1
ORDER BY pl.created_at DESC LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_quantity
FROM product_like
WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products(user_id, product_name, product_description, price) 
VALUES (1, '텔레토비 (분홍색)', '개봉한 텔레토비 분홍색 팝니다 박스 없어요', 38000);

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, COUNT(pl.id) AS likeCount
FROM products AS p
JOIN product_like AS pl
ON pl.product_id = p.product_id
WHERE p.product_name Like '%test%'
GROUP BY p.id
ORDER BY p.created_at DESC LIMIT 10 OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT *
FROM products AS p
JOIN product_like AS pl
ON p.product_id = pl.product_id
JOIN users AS u
ON u.user_id = p.user_id
JOIN comment AS c
ON c.product_id = p.product_id
WHERE p.user_id =1;

/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
price 40000
WHERE product_id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE product_id =1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_like (user_id, product_id)
VALUES (1, 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_like
WHERE user_id = 1 AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments (user_id, product_id, content)
VALUES(1, 2, '댓글 확인');

/*
  - 최신 순으로 정렬
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT *
FROM comments
WHERE product_id = 1 AND created_at < '2025-03-25'
ORDER BY created_at DESC LIMIT 10;