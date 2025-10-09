-- 유저 테이블
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상품 테이블
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    condition VARCHAR(50),
    is_hot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_seller 
        FOREIGN KEY (seller_id) REFERENCES Users (id) ON DELETE CASCADE
);

-- 상품 이미지 테이블
CREATE TABLE ProductImages (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productimages_product 
        FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE
);

-- 태그 테이블
CREATE TABLE Tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 상품-태그 연결 테이블
CREATE TABLE ProductTags (
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    CONSTRAINT fk_producttags_product 
        FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE,
    CONSTRAINT fk_producttags_tag 
        FOREIGN KEY (tag_id) REFERENCES Tags (id) ON DELETE CASCADE
);

-- 상품 좋아요 테이블
CREATE TABLE ProductLikes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productlikes_user 
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    CONSTRAINT fk_productlikes_product 
        FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE
);

-- 상품 댓글 테이블
CREATE TABLE ProductComments (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productcomments_product 
        FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE,
    CONSTRAINT fk_productcomments_user 
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_products_seller_id ON Products (seller_id);
CREATE INDEX idx_productimages_product_id ON ProductImages (product_id);
CREATE INDEX idx_producttags_tag_id ON ProductTags (tag_id);
CREATE INDEX idx_productlikes_product_id ON ProductLikes (product_id);
CREATE INDEX idx_productcomments_product_id ON ProductComments (product_id);
CREATE INDEX idx_productcomments_user_id ON ProductComments (user_id);