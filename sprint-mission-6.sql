-- # 초급 문제

-- 1. `orders` 테이블에서 모든 주문을 조회하세요.
SELECT * FROM orders;
-- 2. `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.
SELECT * FROM orders WHERE id = 423;
-- 3. `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.
SELECT COUNT(*) AS total_orders FROM orders;
-- 4. `orders` 테이블에서 최신 순으로 주문을 조회하세요. (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)
SELECT * FROM orders ORDER BY date DESC, time DESC;
-- 5. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET 0;
-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
SELECT * FROM orders ORDER BY date DESC, time DESC LIMIT 10 OFFSET 40;
-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
SELECT * FROM orders WHERE id < 42 ORDER BY id DESC LIMIT 10;
-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
SELECT * FROM orders WHERE date >= '2025-03-01' AND date < '2025-04-01';
-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
SELECT * FROM orders WHERE date = '2025-03-12' AND time < '12:00:00';
-- 10. `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)
SELECT * FROM pizza_types WHERE name LIKE '%Cheese%' OR name LIKE '%Chicken';

-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
SELECT pizza_id, COUNT(order_id) FROM order_details GROUP BY pizza_id;
-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
SELECT pizza_id, SUM(quantity) FROM order_details GROUP BY pizza_id;
-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
SELECT * FROM order_details WHERE pizza_id IN (SELECT pizza_id FROM pizzas WHERE price > 20);
-- 4. `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
SELECT date, COUNT(*) AS order_count FROM orders GROUP BY date HAVING COUNT(*) >= 80 ORDER BY order_count DESC;
-- 5. `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
SELECT pizza_id, SUM(quantity) AS total_quantity FROM order_details GROUP BY pizza_id HAVING SUM(quantity) >= 10 ORDER BY total_quantity DESC;
-- 6. `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
SELECT od.pizza_id, SUM(od.quantity * p.price) AS total_revenue FROM order_details od JOIN pizzas p ON od.pizza_id = p.pizza_id GROUP BY od.pizza_id;
-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.
SELECT o.date, COUNT(od.order_id) AS order_count, SUM(od.quantity) AS total_quantity FROM orders o JOIN order_details od ON o.id = od.order_id GROUP BY o.date;

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
SELECT p.*, SUM(od.quantity) AS total_quantity FROM pizzas p JOIN order_details od ON p.pizza_id = od.pizza_id GROUP BY p.pizza_id, p.pizza_type_id, p.size, p.price ORDER BY total_quantity DESC LIMIT 10;

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
SELECT o.date, COUNT(DISTINCT o.id) AS total_orders, SUM(p.price * od.quantity) AS total_amount FROM orders o JOIN order_details od ON o.id = od.order_id JOIN pizzas p ON od.pizza_id = p.pizza_id WHERE o.date >= '2025-03-01' AND o.date < '2025-04-01' GROUP BY o.date ORDER BY o.date; 

/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
        
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
SELECT pt.name AS pizza_name, p.size AS pizza_size, p.price AS pizza_price, od.quantity, (p.price * od.quantity) AS total_amount FROM order_details od JOIN pizzas p ON od.pizza_id = p.pizza_id JOIN pizza_types pt ON p.pizza_type_id = pt.pizza_type_id WHERE od.order_id = 78;

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
SELECT p.size, SUM(p.price * od.quantity) AS total_revenue FROM order_details od JOIN pizzas p ON od.pizza_id = p.pizza_id GROUP BY p.size ORDER BY total_revenue DESC;

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
SELECT pt.name, SUM(p.price * od.quantity) AS total_revenue FROM order_details od JOIN pizzas p ON od.pizza_id = p.pizza_id JOIN pizza_types pt ON p.pizza_type_id = pt.pizza_type_id GROUP BY pt.name ORDER BY total_revenue DESC;
