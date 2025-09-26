-- psql -h localhost -p 5432 -U postgres   
-- \c sprint7
-- /home/sonj0407/sql-practice/sprint7/schema.sql


CREATE TABLE 
  "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    nickname VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );






CREATE TABLE 
  product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    description VARCHAR(100) NOT NULL,
    image VARCHAR(100) ,
    price INTEGER NOT NULL,
    tag TEXT[],
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id)
  );


-- comment 에서 product_comment로 변경, 아직 실제 db에 적용되지 않았음 
CREATE TABLE 
  product_comment (
    id SERIAL PRIMARY KEY ,
    content VARCHAR(70) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    product_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_product
      FOREIGN KEY (product_id) REFERENCES product(id)
  );



CREATE TABLE
  article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(10) NOT NULL,
    content VARCHAR(10) NOT NULL,
    image VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id)
  );


-- article comment추가, 아직 db에 적용되지 않았음(지금 없는 상태)
CREATE TABLE 
  article_comment (
    id SERIAL PRIMARY KEY ,
    content VARCHAR(70) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    article_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_article
      FOREIGN KEY (article_id) REFERENCES article(id)
  );





-- 이름을 like에서 product_like로 변경, db에 적용되지 않았음 
CREATE TABLE 
  product_like (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    product_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_product
      FOREIGN KEY (product_id) REFERENCES product(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- article_like 생성, db에 적용되지 않았음 
CREATE TABLE 
  article_like (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    article_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_article
      FOREIGN KEY (article_id) REFERENCES article(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  





--  Seeding 하기 

-- 유저 생성
INSERT INTO "user" (email,password,nickname)
  VALUES 
    ('sonj0407@naver.com', '1234', '손준영'),
    ('sonj0407@daum.net', '1234', '손준영2');

-- product 생성
INSERT INTO product (name, description, image, price, tag, user_id)
  VALUES ('첫번째 물건', '손준영의 물건', 'http:localhost:3000', 40000, ARRAY['첫번째 태그'], 1)

-- article 생성 
INSERT INTO article (title,content,image,user_id)
  VALUES 
    ('첫번째 기사', '기사의 내용' , 'naver.com' , 1),
    ('두번째 기사', '기사의 내용' , 'naver.com' , 1);




-- product comment 생성 
INSERT INTO product_comment (content, user_id, product_id)
  VALUES 
    ('와 이 상품 정말 좋군요', 1, 1),
    ('생각보다 괜찮더라구요', 2, 1);

-- article comment  생성
INSERT INTO article_comment (content, user_id, article_id)
  VALUES 
    ('좋은 게시글 입니다', 1, 1),
    ('잘 읽고 갑니다', 2, 1);


-- product_like 생성 
INSERT INTO product_like (user_id, product_id)
  VALUES 
    (1 , 1);

-- article_like 생성
INSERT INTO article_like (user_id, article_id)
  VALUES 
    (1 , 1);




  -- 스키마에 관한 고민


  -- queries에서 바뀐 모델 이름 수정하기 