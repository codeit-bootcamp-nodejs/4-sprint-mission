/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
FROM user
  UPDATE nickname = `test`
WHERE user.id = 1

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
  FROM product
WHERE 
  product.user_id = 1
ORDER BY product.created_at DESC
OFFSET 20
LIMIT 10


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*)
FROM product as p
GROUP BY p.user_id
WHERE p.user_id = 1




/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
  FROM Product As p
JOIN `like` AS l
  ON l.user_id = p.user_id
WHERE p.user_id = 1
ORDER BY p.created_at DESC
OFFSET 20
LIMIT 10 




/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT 
FROM 



/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO product (image, name, description, price, tag)
VALUES 

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT *
  FROM product
WHERE product.name LIKE `%test`
ORDER BY product.created_at DESC
LIMIT 10


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT p.*
  FROM product AS p
WHERE p.id = 1


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE product
  SET colmun =  value

WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM product
  WHERE id = 1 


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO `like` (user_id, product_id)
  VALUES (1,2) 


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE WHERE `like`
  WHERE
   like.user_id = 1 AND
   like.product_id = 2

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comment
VALUES (user_id, product_id,content)
  (1,2, '이 상품은 정말 좋아요 ')


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
