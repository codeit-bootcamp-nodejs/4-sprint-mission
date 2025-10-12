CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_name TEXT NOT NULL,
  introduce TEXT NOT NULL,
  price REAL NOT NULL,
  image_url TEXT,
  created_at DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE articles (
  article_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE product_comments (
  product_comment_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE article_comments (
  article_comment_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

CREATE TABLE product_likes (
  product_like_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  liked BOOLEAN NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE article_likes (
  article_like_id SERIAL PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  liked BOOLEAN NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE article_images (
  article_image_id SERIAL PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  image_url TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  tag_name TEXT NOT NULL
);

CREATE TABLE product_tags (
  product_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);

INSERT INTO
  users (email, nickname, password)
VALUES
  ('user1@example.com', 'user1', 'password1'),
  ('user2@example.com', 'user2', 'password2'),
  ('user3@example.com', 'user3', 'password3'),
  ('user4@example.com', 'user4', 'password4'),
  ('user5@example.com', 'user5', 'password5'),
  ('user6@example.com', 'user6', 'password6'),
  ('user7@example.com', 'user7', 'password7'),
  ('user8@example.com', 'user8', 'password8'),
  ('user9@example.com', 'user9', 'password9'),
  ('user10@example.com', 'user10', 'password10');

-- Products (1000개, 랜덤 가격 0 ~ 10000)
INSERT INTO products (user_id, product_name, introduce, price)
SELECT
  (floor(random() * 10) + 1)::INT,
  'Product_test ' || i,
  'This is product ' || i,
  round((random() * 10000)::numeric, 2)::REAL
FROM generate_series(1, 1000) AS s(i);

-- Articles (1000개)
INSERT INTO articles (user_id, title, content)
SELECT
  (floor(random() * 10) + 1)::INT,
  'Article Title ' || i,
  'This is article content ' || i
FROM generate_series(1, 1000) AS s(i);

-- Product Comments (1000개)
INSERT INTO product_comments (user_id, product_id, content)
SELECT
  (floor(random() * 10) + 1)::INT,
  (floor(random() * 1000) + 1)::INT,
  'Product comment ' || i
FROM generate_series(1, 1000) AS s(i);

-- Article Comments (1000개)
INSERT INTO article_comments (user_id, article_id, content)
SELECT
  (floor(random() * 10) + 1)::INT,
  (floor(random() * 1000) + 1)::INT,
  'Article comment ' || i
FROM generate_series(1, 1000) AS s(i);

-- Product Likes (1000개)
INSERT INTO product_likes (product_id, user_id, liked)
SELECT
  (floor(random() * 1000) + 1)::INT,
  (floor(random() * 10) + 1)::INT,
  (random() > 0.5) -- true / false 랜덤
FROM generate_series(1, 1000) AS s(i);

-- Article Likes (1000개)
INSERT INTO article_likes (article_id, user_id, liked)
SELECT
  (floor(random() * 1000) + 1)::INT,
  (floor(random() * 10) + 1)::INT,
  (random() > 0.5)
FROM generate_series(1, 1000) AS s(i);

-- Tags (10개 고정)
INSERT INTO tags (tag_name) VALUES
  ('Tech'), ('Food'), ('Travel'), ('Health'), ('Fashion'),
  ('Music'), ('Sports'), ('Education'), ('Gaming'), ('Lifestyle');

-- Product Tags (1000개)
INSERT INTO product_tags (product_id, tag_id)
SELECT
  (floor(random() * 1000) + 1)::INT,
  (floor(random() * 10) + 1)::INT
FROM generate_series(1, 1000) AS s(i)
ON CONFLICT DO NOTHING;