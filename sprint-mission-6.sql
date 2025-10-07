-- SQL 스프린트 미션 6번.


-- 1번 
SELECT * FROM orders;

-- 2번
SELECT * FROM orders WHERE id = 423;

-- 3번
SELECT COUNT(*) AS total_orders FROM orders;

-- 4번
SELECT * 
FROM orders
ORDER BY date DESC, time DESC;

-- 5번
SELECT * 
FROM orders
ORDER BY date DESC, time DESC
LIMIT 10 OFFSET 0;

-- 6번
SELECT * 
FROM orders
ORDER BY date DESC, time DESC
LIMIT 10 OFFSET 40;

-- 7번
SELECT * 
FROM orders
WHERE id < 42
ORDER BY id DESC
LIMIT 10;

--8번
SELECT * 
FROM orders
WHERE date >= '2025-03-01' AND date < '2025-04-01';

-- 9번
SELECT * 
FROM orders
WHERE date = '2025-03-12' 
  AND time < '12:00:00';

-- 10번
SELECT * 
FROM pizza_types
WHERE name LIKE '%Cheese%'
   OR name LIKE '%Chicken%';


----------------------중급-----------------------

-- 1번
SELECT pizza_id, COUNT(order_id) AS order_count
FROM order_details
GROUP BY pizza_id;

-- 2번
SELECT pizza_id, SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id;

-- 3번
SELECT * 
FROM order_details
WHERE pizza_id IN (
  SELECT id 
  FROM pizzas
  WHERE price > 20
);

-- 4번
SELECT date, COUNT(*) AS order_count
FROM orders
GROUP BY date
HAVING COUNT(*) >= 80
ORDER BY order_count DESC;

-- 5번
SELECT pizza_id, SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id
HAVING SUM(quantity) >= 10
ORDER BY total_quantity DESC;

-- 6번
SELECT od.pizza_id, SUM(od.quantity * p.price) AS total_revenue
FROM order_details od
JOIN pizzas p ON od.pizza_id = p.id
GROUP BY od.pizza_id;

-- 7번
SELECT o.date, 
       COUNT(o.id) AS order_count, 
       SUM(od.quantity) AS total_quantity
FROM orders o
JOIN order_details od ON o.id = od.order_id
GROUP BY o.date
ORDER BY o.date;


-----------------------------------고오오급--------------------------------

-- 1번 
-- Group by ~ 로 피자별 집계, LIMIT!@!
SELECT p.*, SUM(od.quantity) AS total_quantity
FROM order_details od
JOIN pizzas p ON od.pizza_id = p.id
GROUP BY p.id
ORDER BY total_quantity DESC
LIMIT 10;

-- 2번
SELECT o.date, 
       COUNT(o.id) AS total_orders, 
       SUM(od.quantity * p.price) AS total_amount
FROM orders o
JOIN order_details od ON o.id = od.order_id
JOIN pizzas p ON od.pizza_id = p.id
WHERE o.date >= '2025-03-01' AND o.date < '2025-04-01'
GROUP BY o.date
ORDER BY o.date;

-- 3번
SELECT pt.name AS pizza_name, 
       p.size AS pizza_size, 
       p.price AS pizza_price, 
       od.quantity, 
       (od.quantity * p.price) AS total_amount
FROM order_details od
JOIN pizzas p ON od.pizza_id = p.id
JOIN pizza_types pt ON p.pizza_type_id = pt.id
WHERE od.order_id = 78;

-- 4번
SELECT p.size, SUM(od.quantity * p.price) AS total_revenue
FROM order_details od
JOIN pizzas p ON od.pizza_id = p.id
GROUP BY p.size
ORDER BY total_revenue DESC;

-- 5번
SELECT pt.name, SUM(od.quantity * p.price) AS total_revenue
FROM order_details od
JOIN pizzas p ON od.pizza_id = p.id
JOIN pizza_types pt ON p.pizza_type_id = pt.id
GROUP BY pt.name
ORDER BY total_revenue DESC;
