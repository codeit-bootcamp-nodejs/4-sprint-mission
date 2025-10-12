/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users SET nickname = 'test' WHERE user_id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT
USER_ID,
PRODUCT_ID,
CREATED_AT
FROM PRODUCTS
WHERE USER_ID = 1
ORDER BY CREATED_AT DESC
LIMIT 10
OFFSET 20;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT
U.USER_ID,
COUNT(P.PRODUCT_ID)
FROM
USERS AS U
LEFT JOIN PRODUCTS AS P
ON U.USER_ID = P.USER_ID
GROUP BY U.USER_ID
HAVING U.USER_ID =1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT
P.PRODUCT_NAME
FROM PRODUCTS AS P
INNER JOIN
(SELECT
USER_ID,
PRODUCT_ID,
LIKED
FROM PRODUCT_LIKES
WHERE LIKED = TRUE
AND USER_ID = 1) AS LIKED_USER
ON P.PRODUCT_ID = LIKED_USER.PRODUCT_ID
ORDER BY CREATED_AT DESC
LIMIT 10
OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT
USER_ID,
COUNT(LIKED_PRODUCT)
FROM
(SELECT
USER_ID,
PRODUCT_ID AS LIKED_PRODUCT,
LIKED
FROM PRODUCT_LIKES
WHERE LIKED = TRUE)
GROUP BY USER_ID
HAVING USER_ID = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (user_id, product_name, introduce, price)
VALUES (1, 'test_product', 'This is test product', 3500);

/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  sub.product_name,
  COUNT(sub.liked)
FROM (
  SELECT
    P.product_name,
    PL.product_id,
    PL.liked,
    P.created_At
  FROM product_likes AS PL
  LEFT JOIN products AS P
    ON PL.product_id = P.product_id
	ORDER BY P.CREATED_AT
) AS sub
WHERE sub.liked = TRUE
  AND sub.product_name LIKE '%test%'
GROUP BY sub.product_name
LIMIT 10;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT * FROM PRODUCTS
WHERE PRODUCT_ID = 1;

/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE
PRODUCTS 
SET 
PRODUCT_NAME = 'mission7',
INTRODUCE = 'THIS IS MISSION 7',
PRICE = 2500
WHERE PRODUCT_ID = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products WHERE product_id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (product_id, user_id, liked)
VALUES (2, 1, true);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
UPDATE product_likes SET liked = false
WHERE user_id = 1
AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_comments (user_id, product_id, content)
VALUES (1, 2, 'Comment test');

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT
PRODUCT_ID,
CONTENT,
CREATED_AT
FROM
PRODUCT_COMMENTS
WHERE PRODUCT_ID = 1
AND CREATED_AT < '2025-03-25'
ORDER BY CREATED_AT DESC
LIMIT 10;