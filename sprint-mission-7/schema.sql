-- schema.sql (PostgreSQL, minimal & clean)

-- 0) 기존 테이블 있으면 정리
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS product_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1) users
CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  email        VARCHAR(120) NOT NULL UNIQUE,
  password     VARCHAR(120) NOT NULL,
  nickname     VARCHAR(60)  NOT NULL UNIQUE,
  image_url    VARCHAR(255),
  introduction TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) products
--    status는 ENUM 대신 CHECK로 심플 처리
CREATE TABLE products (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             VARCHAR(100) NOT NULL,
  description      TEXT NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  status           TEXT NOT NULL DEFAULT 'FOR_SALE',
  image_url        VARCHAR(255),
  tags             TEXT[],  -- 단순 태그: 정규화 대신 배열 사용함.
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_products_status
    CHECK (status IN ('FOR_SALE','RESERVED','SOLD_OUT'))
);
CREATE INDEX idx_products_user_id     ON products(user_id);
CREATE INDEX idx_products_created_at  ON products(created_at DESC);

-- 3) posts 
CREATE TABLE posts (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  image_url   VARCHAR(255),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_user_id     ON posts(user_id);
CREATE INDEX idx_posts_created_at  ON posts(created_at DESC);

-- 4) comments 
CREATE TABLE comments (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  BIGINT REFERENCES products(id) ON DELETE CASCADE,
  post_id     BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_comments_exactly_one
    CHECK ( (product_id IS NULL) <> (post_id IS NULL) )
);
CREATE INDEX idx_comments_product_id ON comments(product_id);
CREATE INDEX idx_comments_post_id    ON comments(post_id);

-- 5) likes 
CREATE TABLE product_likes (
  user_id    BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
CREATE INDEX idx_product_likes_product_id ON product_likes(product_id);

CREATE TABLE post_likes (
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
