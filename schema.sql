CREATE DATABASE IF NOT EXISTS pandaMarket;

-- 유저
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    googleId VARCHAR(255) UNIQUE,
    kakaoId VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()    
);


-- 상품
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    imageUrl TEXT,
    likeCount INT DEFAULT 0,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    ADD CONSTRAINT description_length CHECK (LENGTH(description)>0)
);


-- 게시글
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    imageUrl TEXT,
    likeCount INT DEFAULT 0,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
)

-- 댓글
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    productId INT REFERENCES products(id) ON DELETE CASCADE,
    postId INT REFERENCES posts(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT one_part CHECK (
        (productId IS NOT NULL AND postId IS NULL) OR 
        (productId IS NULL AND postId IS NOT NULL)
    )
);

-- 좋아요
CREATE TABLE product_likes (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    productId INT REFERENCES products(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW(),

    UNIQUE (userId, productId),
)

CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id) ON DELETE CASCADE,
    postId INT REFERENCES posts(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW(),

    UNIQUE (userId, postId),
);