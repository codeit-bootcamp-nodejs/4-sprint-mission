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
SELECT 
  id, name, price, created_at
FROM products
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_products
FROM products
WHERE user_id = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT 
  p.id, 
  p.name, 
  p.price, 
  (SELECT i.image_url 
     FROM images i 
     WHERE i.product_id = p.id AND i.is_main = TRUE 
     LIMIT 1) AS thumbnail,
  l.created_at AS liked_at
FROM likes l
JOIN products p ON p.id = l.product_id
WHERE l.user_id = 1
ORDER BY l.created_at DESC
LIMIT 10 OFFSET 20;


/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_liked_products
FROM likes
WHERE user_id = 1 AND product_id IS NOT NULL;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
  - 상품과 이미지 등록
*/
BEGIN;

INSERT INTO products (user_id, name, description, price)
VALUES (1, '테스트 상품', '테스트용 상품입니다.', 15000);

INSERT INTO images (product_id, image_url, is_main)
VALUES (
  (SELECT id FROM products ORDER BY id DESC LIMIT 1),
  'https://example.com/images/test-product.jpg',
  TRUE
);

COMMIT;


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
  p.price,
  (SELECT i.image_url 
     FROM images i 
     WHERE i.product_id = p.id AND i.is_main = TRUE 
     LIMIT 1) AS thumbnail,
  COUNT(l.id) AS like_count,
  p.created_at
FROM products p
LEFT JOIN likes l ON l.product_id = p.id
WHERE p.name ILIKE '%test%'
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
  - 이미지 배열 + 좋아요 수 포함
*/
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  ARRAY_AGG(i.image_url ORDER BY i.id) AS images,
  COUNT(l.id) AS like_count,
  p.created_at
FROM products p
LEFT JOIN images i ON i.product_id = p.id
LEFT JOIN likes l ON l.product_id = p.id
WHERE p.id = 1
GROUP BY p.id;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
SET 
  name = '수정된 상품명',
  description = '상품 설명이 수정되었습니다.',
  price = 18000
WHERE id = 1 AND user_id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1 AND user_id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO likes (user_id, product_id)
VALUES (1, 2)
ON CONFLICT (user_id, product_id) DO NOTHING;


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM likes
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments (user_id, product_id, content)
VALUES (1, 2, '좋은 상품이네요!');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT 
  c.id,
  u.nickname AS author,
  c.content,
  c.created_at
FROM comments c
JOIN users u ON u.id = c.user_id
WHERE c.product_id = 1
  AND c.created_at < '2025-03-25'
ORDER BY c.created_at DESC
LIMIT 10;
