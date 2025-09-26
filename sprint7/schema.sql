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



CREATE TABLE 
  comment (
    id SERIAL PRIMARY KEY ,
    content VARCHAR(70) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    product_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_article
      FOREIGN KEY (product_id) REFERENCES product(id)
  );




CREATE TABLE 
  "like" (
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


-- comment 생성 
INSERT INTO comment (content, user_id, product_id)
  VALUES 
    ('와 이 상품 정말 좋군요', 1, 1),
    ('생각보다 괜찮더라구요', 2, 1);


-- like 생성 
INSERT INTO "like" (user_id, product_id)
  VALUES 
    (1 , 1);




  -- foreign key 설정하기                     완료 
  -- like n:m 모델 생성하기                    완료
  -- tag 어떻게 구상할지 생각하기               완료
  -- default now 문법 맞는지 검사하기          완료
  -- seeding 하기                            완료
  -- image에 string만 담을지, 이미지 자체를 담을지 생각하기    완료 
  -- psql 접속해서 데이터베이스 생성하고, 데이터 베이스에 들어가고, 테이블 생성하기 완료
  -- 문제들 실제로 작동하는지 체크하기           
  -- article, product에 각각 comment를 적용할 것인지?