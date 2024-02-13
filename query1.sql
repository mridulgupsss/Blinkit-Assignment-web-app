-- Retreive list of top selling books

SELECT 
    b.title AS book_title,
    a.author_name,
    SUM(oi.quantity) AS total_sold
FROM 
    books b
JOIN 
    order_items oi ON b.book_id = oi.book_id
JOIN 
    authors a ON b.author_id = a.author_id
GROUP BY 
    b.title, a.author_name
ORDER BY 
    total_sold DESC
LIMIT 10; 
