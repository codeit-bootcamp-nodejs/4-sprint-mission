
BEGIN;

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
  id             BIGSERIAL PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  nickname       VARCHAR(50)  NOT NULL UNIQUE,
  profile_image  TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email_ci    ON users ((LOWER(email)));
CREATE INDEX IF NOT EXISTS idx_users_nickname_ci ON users ((LOWER(nickname)));
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS categories (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tags (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL PRIMARY KEY,
  seller_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   BIGINT           REFERENCES categories(id) ON DELETE SET NULL,
  name          VARCHAR(120) NOT NULL,
  description   TEXT         NOT NULL,
  price         NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  condition     VARCHAR(16)  NOT NULL DEFAULT 'NEW'
                CHECK (condition IN ('NEW','LIKE_NEW','GOOD','FAIR','POOR')),
  status        VARCHAR(16)  NOT NULL DEFAULT 'FOR_SALE'
                CHECK (status IN ('FOR_SALE','RESERVED','SOLD_OUT','HIDDEN')),
  like_count    INTEGER      NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  view_count    INTEGER      NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price      ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_status     ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_title_ci   ON products ((LOWER(name)));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS product_images (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT   NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, sort_order)
);

-- Product ↔ Tags (N:M)
CREATE TABLE IF NOT EXISTS product_tags (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     BIGINT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS product_likes (
  user_id    BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- Product comments (Q&A) - simple nesting
CREATE TABLE IF NOT EXISTS product_comments (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  parent_id   BIGINT REFERENCES product_comments(id)  ON DELETE CASCADE,
  content     TEXT   NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_comments_product ON product_comments (product_id);
CREATE TRIGGER trg_product_comments_upd BEFORE UPDATE ON product_comments FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS reservations (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id    BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  status      VARCHAR(16) NOT NULL DEFAULT 'REQUESTED'
               CHECK (status IN ('REQUESTED','CONFIRMED','CANCELED','COMPLETED')),
  message     VARCHAR(500),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, buyer_id)
);
CREATE INDEX IF NOT EXISTS idx_reservations_product ON reservations (product_id);
CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS boards (
  id    BIGSERIAL PRIMARY KEY,
  code  VARCHAR(30) NOT NULL UNIQUE,
  name  VARCHAR(60) NOT NULL
);
INSERT INTO boards (code, name) VALUES ('free','자유게시판')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS posts (
  id         BIGSERIAL PRIMARY KEY,
  board_id   BIGINT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  author_id  BIGINT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  title      VARCHAR(150) NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_board_created ON posts (board_id, created_at DESC);
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS post_comments (
  id         BIGSERIAL PRIMARY KEY,
  post_id    BIGINT NOT NULL REFERENCES posts(id)   ON DELETE CASCADE,
  user_id    BIGINT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  parent_id  BIGINT REFERENCES post_comments(id)    ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments (post_id);
CREATE TRIGGER trg_post_comments_upd BEFORE UPDATE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS post_likes (
  user_id    BIGINT NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  post_id    BIGINT NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

COMMIT;
