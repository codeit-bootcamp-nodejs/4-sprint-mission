-- 사용자 테이블
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       nickname VARCHAR(50) UNIQUE NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상품 테이블
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
                          image_url VARCHAR(255),
                          tags TEXT[],
                          status VARCHAR(20) DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'sold')),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 자유게시판 게시글 테이블
CREATE TABLE posts (
                       id SERIAL PRIMARY KEY,
                       author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       title VARCHAR(255) NOT NULL,
                       content TEXT,
                       image_url VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상품 문의 테이블
CREATE TABLE inquiries (
                           id SERIAL PRIMARY KEY,
                           product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                           user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                           content TEXT NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 좋아요 테이블
CREATE TABLE likes (
                       user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       PRIMARY KEY (user_id, product_id)
);