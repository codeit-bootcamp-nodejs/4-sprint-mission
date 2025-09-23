-- 데이터베이스 생성
CREATE DATABASE panda_market;

-- users 테이블 생성
CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- social_login_users 테이블 생성
CREATE TABLE social_login_users (
  user_id INT PRIMARY KEY,
  provider_name VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL, 
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- products 테이블 생성
CREATE TABLE products (
  product_id BIGSERIAL PRIMARY KEY,
  user_id INT,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT NOT NULL, 
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- product_like 테이블 생성
CREATE TABLE product_like (
  user_id INT,
  product_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- product_image 테이블 생성
CREATE TABLE product_image (
  product_image_id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT FALSE, 

  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- tags 테이블 생성
CREATE TABLE tags (
  tag_id BIGSERIAL PRIMARY KEY,
  tag_name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- product_tags 테이블 생성
CREATE TABLE product_tags (
  product_id INT,
  tag_id INT,

  PRIMARY KEY (product_id, tag_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- posts 테이블 생성
CREATE TABLE posts (
  post_id BIGSERIAL PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(), 

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- post_like 테이블 생성
CREATE TABLE post_like (
  user_id INT,
  post_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- comments 테이블 생성
CREATE TABLE comments (
  comment_id BIGSERIAL PRIMARY KEY,
  user_id INT,
  post_id INT,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(), 

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- post_image 테이블 생성
CREATE TABLE post_image (
  post_image_id BIGSERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,

  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);