
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- USERS
-- ===========================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  password VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- PRODUCTS
-- ===========================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  price INT NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_products_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- IMAGES (상품 1:N)
-- ===========================================
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_images_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_images_product_id ON images(product_id);

CREATE TRIGGER trg_images_updated_at
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ARTICLES (게시판)
-- ===========================================
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_articles_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_articles_user_id ON articles(user_id);
CREATE INDEX idx_articles_created_at ON articles(created_at);

CREATE TRIGGER trg_articles_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- COMMENTS (상품/게시글 둘 다 가능)
-- ===========================================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT,
  article_id INT,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_article FOREIGN KEY (article_id)
    REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT chk_comment_target CHECK (
    (product_id IS NOT NULL AND article_id IS NULL) OR
    (product_id IS NULL AND article_id IS NOT NULL)
  )
);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_product_id ON comments(product_id);
CREATE INDEX idx_comments_article_id ON comments(article_id);

CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- LIKES (상품/게시글 좋아요)
-- ===========================================
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT,
  article_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_article FOREIGN KEY (article_id)
    REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT uq_like_product UNIQUE (user_id, product_id),
  CONSTRAINT uq_like_article UNIQUE (user_id, article_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);

CREATE TRIGGER trg_likes_updated_at
BEFORE UPDATE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FAVORITES
-- ===========================================
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT uq_favorites UNIQUE (user_id, product_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

CREATE TRIGGER trg_favorites_updated_at
BEFORE UPDATE ON favorites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TAGS / PRODUCT_TAGS
-- ===========================================
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE product_tags (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  tag_id INT NOT NULL,
  CONSTRAINT fk_product_tags_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_tags_tag FOREIGN KEY (tag_id)
    REFERENCES tags(id) ON DELETE CASCADE,
  CONSTRAINT uq_product_tags UNIQUE (product_id, tag_id)
);

CREATE INDEX idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag_id ON product_tags(tag_id);
