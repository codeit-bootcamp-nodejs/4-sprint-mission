-- # 초급 문제

-- 1. `orders` 테이블에서 모든 주문을 조회하세요.
SELECT * FROM orders;
-- 2. `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.
SELECT * FROM orders WHERE id = '423';
-- 3. `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.
SELECT COUNT(*) as total_orders FROM orders;
-- 4. `orders` 테이블에서 최신 순으로 주문을 조회하세요. (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)
SELECT * FROM orders ORDER BY date DESC, time DESC;
-- 5. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET 0;
-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET (10*5-1);
-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
SELECT * FROM orders WHERE id < 42 ORDER BY date DESC, time DESC LIMIT 10;
-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
SELECT * FROM orders WHERE date >= '2025-03-01' AND date < '2025-04-01' ORDER BY date DESC, time DESC;
-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
SELECT * FROM orders WHERE date = '2025-03-12' AND time < '12:00:00' ORDER BY date DESC, time DESC;
-- 10. `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)
SELECT * FROM pizza_types 
WHERE name LIKE '%Cheese%'
   OR name LIKE '%Chicken%' ;

-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
SELECT pizza_id, COUNT(order_id)
FROM order_details
GROUP BY pizza_id;
-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
SELECT pizza_id, COUNT(quantity)
FROM order_details
GROUP BY pizza_id;
-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
SELECT *
FROM order_details
WHERE pizza_id IN (
    SELECT pizza_id
    FROM pizzas
    WHERE price > 20
);
-- 4. `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
SELECT DATE(date) AS order_date, COUNT(*) AS order_count FROM orders
GROUP BY date
HAVING COUNT(*) > 80
ORDER BY order_count desc;
-- 5. `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
SELECT pizza_id, COUNT(quantity) as total FROM order_details
GROUP BY pizza_id
HAVING COUNT(quantity) > 10
ORDER BY total desc;
-- 6. `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
SELECT p.id, SUM(o.quantity * p.price) as total_revenue
FROM order_details as o
JOIN pizzas as p
ON o.pizza_id = p.id
GROUP BY p.id;
-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.
SELECT DATE(o.date) AS order_date, COUNT(*) AS order_count, SUM(quantity) as total_quantity
FROM orders as o
INNER JOIN order_details as d
	ON o.id = d.order_id
GROUP BY o.date
-- # 고급 문제

/*
    1. 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
        
        출력 예시:

        ```sql
            big_meat_s    | big_meat    | S    |    12 |           1914
            thai_ckn_l    | thai_ckn    | L    | 20.75 |           1410
            five_cheese_l | five_cheese | L    |  18.5 |           1409
            four_cheese_l | four_cheese | L    | 17.95 |           1316
            classic_dlx_m | classic_dlx | M    |    16 |           1181
            spicy_ital_l  | spicy_ital  | L    | 20.75 |           1109
            hawaiian_s    | hawaiian    | S    |  10.5 |           1020
            southw_ckn_l  | southw_ckn  | L    | 20.75 |           1016
            bbq_ckn_l     | bbq_ckn     | L    | 20.75 |            992
            bbq_ckn_m     | bbq_ckn     | M    | 16.75 |            956
        ```
*/

SELECT p.*, SUM(d.quantity) as total_quantity
FROM pizzas as p
JOIN order_details as d
    ON p.id = d.pizza_id
GROUP BY p.id
ORDER BY total_quantity desc
LIMIT 10

/*
    2. `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
        
        출력 예시:
        
        ```sql
        2025-03-01 |           49 | 1598.5500011444092
        2025-03-02 |           58 |  2379.050001144409
        2025-03-03 |           53 | 2287.8999996185303
        2025-03-04 |           59 |  2444.300001144409
        2025-03-05 |           64 |  2350.650005340576
        ```
*/

SELECT DATE(date) AS order_date, COUNT(*) AS total_orders, SUM(d.quantity * p.price) as total_aamount
FROM orders as o

INNER JOIN order_details as d
ON o.id = d.order_id

INNER JOIN pizzas as p
ON d.pizza_id = p.id

WHERE date >= '2025-03-01' AND date < '2025-04-01'

GROUP BY date
ORDER BY date asc;


/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 
    각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 
    각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza      | S          |       12.75 |        1 |              12.75
        The Big Meat Pizza          | S          |          12 |        1 |                 12
        The Classic Deluxe Pizza    | S          |          12 |        1 |                 12
        The Italian Capocollo Pizza | M          |          16 |        1 |                 16
        The Spicy Italian Pizza     | L          |       20.75 |        3 |              62.25
        The Four Cheese Pizza       | L          |       17.95 |        1 | 17.950000762939453
        ```
*/

SELECT t.name as pizza_name, p.size as pizza_size, p.price as pizza_price, d.quantity, SUM(d.quantity * p.price) as total_amount
FROM orders as o

INNER JOIN order_details as d
ON o.id = d.order_id

INNER JOIN pizzas as p
ON d.pizza_id = p.id

INNER JOIN pizza_types as t
ON p.type_id = t.id

WHERE o.id = 78

GROUP BY t.name, p.size, p.price, d.quantity;

/*    
    4. `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
        
        출력 예시:
        
        ```sql
        L    |  375318.7010040283
        M    |          249382.25
        S    | 178076.49981307983
        XL   |              14076
        XXL  | 1006.6000213623047
        ```
*/

SELECT p.size, SUM(d.quantity * p.price) as total_amount
FROM order_details as d
INNER JOIN pizzas as p
ON d.pizza_id = p.id
GROUP BY p.size

/*    
    5. `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza                     |           43434.25
        The Barbecue Chicken Pizza                 |              42768
        The California Chicken Pizza               |            41409.5
        The Classic Deluxe Pizza                   |            38180.5
        The Spicy Italian Pizza                    |           34831.25
        The Southwest Chicken Pizza                |           34705.75
        The Italian Supreme Pizza                  |           33476.75
        ```
*/

SELECT t.name, SUM(d.quantity * p.price) as total_amount
FROM pizza_types as t

INNER JOIN pizzas as p
ON t.id = p.type_id

INNER JOIN order_details as d
ON p.id = d.pizza_id

GROUP BY t.name
ORDER BY total_amount DESC;
