-- 판다마켓 서비스의 데이터베이스 스키마

-- Users: 사용자 정보를 저장하는 테이블
CREATE TABLE Users (
    user_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    nickname        VARCHAR(50) NOT NULL UNIQUE,
    profile_image_url VARCHAR(255) NULL,
    introduction    TEXT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products: 판매 상품 정보를 저장하는 테이블
CREATE TABLE Products (
    product_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id       BIGINT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NOT NULL,
    price           INT UNSIGNED NOT NULL,
    image_url       VARCHAR(255) NULL,
    status          ENUM('FOR_SALE', 'RESERVED', 'SOLD_OUT') DEFAULT 'FOR_SALE',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Tags: 상품 태그 정보를 저장하는 테이블
CREATE TABLE Tags (
    tag_id          INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50) NOT NULL UNIQUE
);

-- Product_Tags: 상품과 태그의 다대다(N:M) 관계를 위한 중간 테이블
CREATE TABLE Product_Tags (
    product_id      BIGINT NOT NULL,
    tag_id          INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Product_Likes: 사용자와 상품의 '좋아요' 관계를 저장하는 테이블
CREATE TABLE Product_Likes (
    user_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Posts: 자유게시판의 게시글 정보를 저장하는 테이블
CREATE TABLE Posts (
    post_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id       BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    image_url       VARCHAR(255) NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Comments: 상품 문의와 게시글 댓글을 모두 저장하는 통합 테이블
CREATE TABLE Comments (
    comment_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id       BIGINT NOT NULL,
    target_type     ENUM('PRODUCT', 'POST') NOT NULL, -- 댓글의 대상 타입 (상품 문의인지, 게시글 댓글인지)
    target_id       BIGINT NOT NULL, -- 대상의 ID (product_id 또는 post_id)
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(user_id) ON DELETE CASCADE
);           