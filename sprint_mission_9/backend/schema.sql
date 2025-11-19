
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

CREATE TABLE IF NOT EXISTS notifications (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(50) NOT NULL
                  CHECK (type IN ('PRODUCT_PRICE_CHANGE', 'POST_COMMENT', 'PRODUCT_COMMENT')),
  title           VARCHAR(200) NOT NULL,
  message         TEXT NOT NULL,
  product_id      BIGINT REFERENCES products(id) ON DELETE CASCADE,
  post_id         BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  comment_id      BIGINT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_product ON notifications (product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_post ON notifications (post_id) WHERE post_id IS NOT NULL;

CREATE OR REPLACE FUNCTION notify_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.price IS DISTINCT FROM NEW.price THEN
    INSERT INTO notifications (user_id, type, title, message, product_id)
    SELECT
      pl.user_id,
      'PRODUCT_PRICE_CHANGE',
      '좋아요한 상품 가격이 변경되었습니다',
      CASE
        WHEN NEW.price > OLD.price THEN
          '"' || NEW.name || '" 상품의 가격이 ' ||
          TO_CHAR(OLD.price, 'FM999,999,999') || '원에서 ' ||
          TO_CHAR(NEW.price, 'FM999,999,999') || '원으로 인상되었습니다.'
        ELSE
          '"' || NEW.name || '" 상품의 가격이 ' ||
          TO_CHAR(OLD.price, 'FM999,999,999') || '원에서 ' ||
          TO_CHAR(NEW.price, 'FM999,999,999') || '원으로 인하되었습니다.'
      END,
      NEW.id
    FROM product_likes pl
    WHERE pl.product_id = NEW.id
      AND pl.user_id != NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_price_change
  AFTER UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION notify_price_change();

CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_author_id BIGINT;
  v_post_title VARCHAR(150);
  v_commenter_nickname VARCHAR(50);
BEGIN
  SELECT p.author_id, p.title INTO v_author_id, v_post_title
  FROM posts p WHERE p.id = NEW.post_id;

  SELECT u.nickname INTO v_commenter_nickname
  FROM users u WHERE u.id = NEW.user_id;

  IF v_author_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, title, message, post_id, comment_id)
    VALUES (
      v_author_id,
      'POST_COMMENT',
      '내 게시글에 새 댓글이 달렸습니다',
      v_commenter_nickname || '님이 "' || v_post_title || '" 게시글에 댓글을 남겼습니다: ' ||
      SUBSTRING(NEW.content, 1, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END,
      NEW.post_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_comment_notification
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_comment();

CREATE OR REPLACE FUNCTION notify_product_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_id BIGINT;
  v_product_name VARCHAR(120);
  v_commenter_nickname VARCHAR(50);
BEGIN
  SELECT p.seller_id, p.name INTO v_seller_id, v_product_name
  FROM products p WHERE p.id = NEW.product_id;

  SELECT u.nickname INTO v_commenter_nickname
  FROM users u WHERE u.id = NEW.user_id;

  IF v_seller_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, title, message, product_id, comment_id)
    VALUES (
      v_seller_id,
      'PRODUCT_COMMENT',
      '내 상품에 새 댓글이 달렸습니다',
      v_commenter_nickname || '님이 "' || v_product_name || '" 상품에 댓글을 남겼습니다: ' ||
      SUBSTRING(NEW.content, 1, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END,
      NEW.product_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_comment_notification
  AFTER INSERT ON product_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_product_comment();

COMMIT;
