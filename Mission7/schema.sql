-- 사용자(users Table)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
);

-- 게시글(article Table)
CREATE TABLE article (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id int,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREING KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 제품(product)
CREATE TABLE product (
  id  SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  tags TEXT[] NOT NULL,
  user_id int,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREING KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- 댓글(commend)
CREATE TABLE commend (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  product_id int,
  article_id int,
  user_id int,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREING KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREING KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  FOREING KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
)

-- 즐겨찾기(favorite)
CREATE TABLE favorite (
  id SERIAL PRIMARY KEY,
  product_id int UNIQUE,
  user_id int UNIQUE,
  FOREING KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  FOREING KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- 좋아요 (like)
CREATE TABLE like (
  id SERIAL PRIMARY KEY,
  article_id int UNIQUE,
  user_id int UNIQUE,
  product_id int UNIQUE,
  FOREING KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  FOREING KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
  FOREING KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)