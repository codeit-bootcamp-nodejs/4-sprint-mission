-- psql -h localhost -p 5432 -U postgres   
-- \c pizza_place
-- /home/sonj0407/sql-practice/sprint-mission-6.sql



Use 

CREATE TABLE 
  user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    nickname VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
  )


CREATE TABLE 
  product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    description VARCHAR(100) NOT NULL,
    image VARCHAR(100) ,
    price INTEGER(10) NOT NULL,
    tag TEXT[],
    user_id INTEGER(5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES user(id)
  )

CREATE TABLE
  article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(10) NOT NULL,
    content VARCHAR(10) NOT NULL,
    image VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER(5),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES user(id)
  )

CREATE TABLE 
  comment (
    id SERIAL PRIMARY KEY ,
    content VARCHAR(70) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER(5),
    article_id INTEGER(5),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_article
      FOREIGN KEY (article_id) REFERENCES article(id)
  )

CREATE TABLE 
  like (
    id SERIAL PRIMARY KEY,
    user_id INTEGER(5),
    product_id INTEGER(5),
    CONSTRAINT fk_user
      FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_product
      FOREIGN KEY (product_id) REFERENCES product(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
  



  -- foreign key 설정하기                     완료 
  -- like n:m 모델 생성하기                    완료
  -- tag 어떻게 구상할지 생각하기               완료
  -- default now 문법 맞는지 검사하기          완료
  -- seeding 하기 
  -- image에 string만 담을지, 이미지 자체를 담을지 생각하기    완료 
  -- psql 접속해서 데이터베이스 생성하고, 데이터 베이스에 들어가고, 테이블 생성하기 
  -- 문제들 실제로 작동하는지 체크하기           
  -- article, product에 각각 comment를 적용할 것인지?