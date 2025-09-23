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
SELECT * FROM orders
ORDER BY date DESC, time DESC
    LIMIT 10 OFFSET 0;

-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
SELECT * FROM orders
ORDER BY date DESC, time DESC
    LIMIT 10 OFFSET 40;

-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
SELECT * FROM orders
WHERE id < 42
ORDER BY id DESC
    LIMIT 10;

-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
SELECT * FROM orders
WHERE date >= '2025-03-01' AND date < '2025-04-01';

-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
SELECT * FROM orders
WHERE date = '2025-03-12' AND EXTRACT(HOUR FROM time) < 12;

-- 10. `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)
SELECT * FROM pizza_types
WHERE name LIKE '%Cheese%' OR name LIKE '%Chicken%';


-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
SELECT pizza_id, COUNT(order_id) AS order_count
FROM order_details
GROUP BY pizza_id;

-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
SELECT pizza_id, SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id;

-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
SELECT * FROM order_details
WHERE pizza_id IN (SELECT id FROM pizzas WHERE price > 20);

-- 4. `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
SELECT date, COUNT(id) AS order_count
FROM orders
GROUP BY date
HAVING COUNT(id) >= 80
ORDER BY order_count DESC;

-- 5. `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
SELECT pizza_id, SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id
HAVING SUM(quantity) >= 10
ORDER BY total_quantity DESC;

-- 6. `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
SELECT
    od.pizza_id,
    SUM(od.quantity * p.price) AS total_revenue
FROM order_details AS od
         JOIN pizzas AS p ON od.pizza_id = p.id
GROUP BY od.pizza_id;

-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.
SELECT
    o.date,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(od.quantity) AS total_quantity
FROM orders AS o
         JOIN order_details AS od ON o.id = od.order_id
GROUP BY o.date;


-- # 고급 문제

/*
    1. 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
*/
SELECT
    p.*,
    SUM(od.quantity) AS total_quantity
FROM pizzas AS p
         JOIN order_details AS od ON p.id = od.pizza_id
GROUP BY p.id
ORDER BY total_quantity DESC
    LIMIT 10;


/*
    2. `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
*/
SELECT
    o.date,
    COUNT(DISTINCT od.order_id) AS total_orders,
    SUM(od.quantity * p.price) AS total_amount
FROM orders AS o
         JOIN order_details AS od ON o.id = od.order_id
         JOIN pizzas AS p ON od.pizza_id = p.id
WHERE o.date >= '2025-03-01' AND o.date < '2025-04-01'
GROUP BY o.date
ORDER BY o.date;


/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
*/
SELECT
    pt.name AS pizza_name,
    p.size AS pizza_size,
    p.price AS pizza_price,
    od.quantity,
    (od.quantity * p.price) AS total_amount
FROM order_details AS od
         JOIN pizzas AS p ON od.pizza_id = p.id
         JOIN pizza_types AS pt ON p.type_id = pt.id
WHERE od.order_id = 78;


/* 4. `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
*/
SELECT
    p.size,
    SUM(od.quantity * p.price) AS total_revenue
FROM order_details AS od
         JOIN pizzas AS p ON od.pizza_id = p.id
GROUP BY p.size
ORDER BY total_revenue DESC;


/* 5. `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.
*/
SELECT
    pt.name,
    SUM(od.quantity * p.price) AS total_revenue
FROM order_details AS od
         JOIN pizzas AS p ON od.pizza_id = p.id
         JOIN pizza_types AS pt ON p.type_id = pt.id
GROUP BY pt.name
ORDER BY total_revenue DESC;