/*
약어
u = users
p = products
a = articles
pc = product_comments
pi = product_images
pw = product_wishlist
pt = product_tags
ac = article_comments
ai = article_images
al = article_likes
at = article_tags
*/

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_p_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_a_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(5) NOT NULL UNIQUE
)

CREATE TABLE product_comments (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_pc_p FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE product_tags (
  product_id INT NOT NULL, 
  tag_id INT NOT NULL, 
  PRIMARY KEY (product_id, tag_id),
  CONSTRAINT fk_pt_p REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_t REFERENCES tags(id) ON DELETE CASCADE
)

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  CONSTRAINT fk_pi_p FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)

CREATE TABLE product_wishlist (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_pw_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_pw_p FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT uq_pw UNIQUE (user_id, product_id)
);

CREATE TABLE article_comments (
  id SERIAL PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_ac_a FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ac_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE article_tags (
  article_id INT NOT NULL, 
  tag_id INT NOT NULL, 
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_at_a REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_at_t REFERENCES tags(id) ON DELETE CASCADE
)

CREATE TABLE article_images (
  id SERIAL PRIMARY KEY,
  article_id INT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  CONSTRAINT fk_ai_a FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
)

CREATE TABLE article_likes (
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, article_id),
  CONSTRAINT fk_al_u FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_al_a FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
