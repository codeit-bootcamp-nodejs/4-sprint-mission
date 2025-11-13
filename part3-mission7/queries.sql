/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/

UPDATE users SET username ='test' WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT p.id, p.name, p.price, p.created_at
FROM products AS p 
WHERE p.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/

SELECT p.user_id, COUNT(p.id) AS product_count
FROM products AS p
WHERE p.user_id = 1
GROUP BY p.user_id;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT p.*
FROM product_wishlist AS pw
JOIN products AS p ON p.id = pw.product_id
WHERE pw.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/

SELECT pw.user_id, COUNT(pw.product_id) AS wishlist_count
FROM product_wishlist AS pw
WHERE pw.user_id = 1
GROUP BY pw.user_id;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/

INSERT INTO products (user_id, name, description, price) 
VALUES (1, 'test', 'test', 1234);


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/

SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.created_at,
  COUNT(pw.product_id) AS wishlist_count
FROM products AS p
LEFT JOIN product_wishlist AS pw ON p.id = pw.product_id
WHERE p.name ILIKE '%test%'
GROUP BY p.id, p.name, p.description, p.price, p.created_at
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.created_at,
  p.updated_at,
  ARRAY(
    SELECT t.name
    FROM product_tags AS pt
    JOIN tags AS t ON t.id = pt.tag_id
    WHERE pt.product_id = p.id
  ) AS tags,
  ARRAY(
    SELECT pi.url
    FROM product_images AS pi
    WHERE pi.product_id = p.id
    ORDER BY pi.sort_order
  ) AS images,
  (SELECT COUNT(*) FROM product_wishlist AS pw 
  WHERE pw.product_id = p.id) AS wishlist_count
FROM products AS p
WHERE id = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/

UPDATE products 
SET
  name = 'test1',
  description = 'test1',
  price = 1234,
  updated_at = NOW()
WHERE id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/

DELETE FROM products WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

INSERT INTO product_wishlist (user_id, product_id)
VALUES (1, 2)
ON CONFLICT (user_id, product_id) DO NOTHING;

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM product_wishlist
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO product_comments (user_id, product_id, content)
VALUES (1, 2, 'test');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/

SELECT
  pc.id,
  pc.product_id,
  pc.user_id,
  pc.content,
  pc.created_at
FROM product_comments AS pc
WHERE pc.product_id = 1 AND created_at < '2025-03-25'
ORDER BY created_at DESC
LIMIT 10;