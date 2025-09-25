CREATE DATABASE panda_market;

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL UNIQUE,
    password TEXT,
    provider TEXT,
    providerId TEXT UNIQUE,
    image TEXT,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT user_provider_providerId_unique UNIQUE (provider, providerId)
);

CREATE TABLE "Product" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    tags TEXT[] NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    userId INT,
    CONSTRAINT fk_product_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
); 

CREATE TABLE "Article" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    userId INT,
    CONSTRAINT fk_article_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
);

CREATE TABLE "ProductComment" (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    productId INT NOT NULL,
    userId INT,
    CONSTRAINT fk_productcomment_product FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE,
    CONSTRAINT fk_productcomment_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
);

CREATE TABLE "ArticleComment" (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL,
    articleId INT NOT NULL,
    userId INT,
    CONSTRAINT fk_articlecomment_article FOREIGN KEY (articleId) REFERENCES "Article"(id) ON DELETE CASCADE,
    CONSTRAINT fk_articlecomment_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
);

CREATE TABLE "Image" (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE "ProductImage" (
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    imageId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_productimage_product FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE,
    CONSTRAINT fk_productimage_image FOREIGN KEY (imageId) REFERENCES "Image"(id) ON DELETE CASCADE,
    CONSTRAINT uq_product_image UNIQUE (productId, imageId)
);

CREATE TABLE "ProductLike" (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_productlike_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_productlike_product FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE,
    CONSTRAINT uq_productlike UNIQUE (userId, productId)
);

CREATE INDEX idx_productlike_productId ON "ProductLike"(productId);

CREATE TABLE "ArticleLike" (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    articleId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_articlelike_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_articlelike_article FOREIGN KEY (articleId) REFERENCES "Article"(id) ON DELETE CASCADE,
    CONSTRAINT uq_articlelike UNIQUE (userId, articleId)
);

CREATE INDEX idx_articlelike_articleId ON "ArticleLike"(articleId);

CREATE TABLE "UploadLog" (
    id SERIAL PRIMARY KEY,
    userId INT,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_uploadlog_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE SET NULL
);
