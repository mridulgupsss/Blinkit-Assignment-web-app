-- Calculate total sales revenue for a given period (let's assume the period is a month)

SELECT 
    SUM(oi.total_price) AS total_revenue
FROM 
    orders o
JOIN 
    order_items oi ON o.order_id = oi.order_id
WHERE 
    o.order_date >= '2024-01-01' AND o.order_date < '2024-02-01';
