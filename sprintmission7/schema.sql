-- 유저
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

-- 상품 
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    user_id INT,
    product_name VARCHAR(50) NOT NULL,
    product_description VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE 
  );

-- 상품 좋아요
CREATE TABLE product_like (
    user_id INT,
    product_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
  );

-- 게시글
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY user_id REFERENCES users(user_id) ON DELETE CASCADE
  );

-- 게시글 좋아요
CREATE TABLE post_likes (
    user_id INT,
    post_id INT,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );

-- 게시글 댓글
CREATE TABLE post_comments (
  comment_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 태그
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );

-- 게시글 이미지
CREATE TABLE post_image (
    post_image_id SERIAL PRIMARY KEY,
    post_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY post_id REFERENCES posts(post_id) ON DELETE CASCADE
  );

-- 상품 이미지
 CREATE TABLE product_image (
      product_image_id SERIAL PRIMARY KEY,
      product_id INT,
      image_url VARCHAR(255) NOT NULL,
      FOREIGN KEY (product_Id) REFERENCES products(product_id) ON DELETE CASCADE
    );