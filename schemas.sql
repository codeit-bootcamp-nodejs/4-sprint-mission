-- UUID 자동 생성을 위해 'uuid-ossp' 확장을 활성
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User 테이블 생성
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    "email" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(100) NOT NULL,
    "imageUrl" VARCHAR(100),
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    CONSTRAINT "User_email_key" UNIQUE ("email")
);

-- Product 테이블 생성
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "productName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "price" INT NOT NULL,
    "tags" VARCHAR(100)[],
    "imageUrl" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId"  UUID NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Article 테이블 생성
CREATE TABLE "Article" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(100) NOT NULL,
    "content" ARCHAR(500) NOT NULL,
    "imageUrl" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Comment 테이블 생성
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID,
    "articleId" UUID,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
    CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE
    CONSTRAINT "Comment_check_polymorphic" CHECK (("productId" IS NULL) != ("articleId" IS NULL))
);

-- ProductLike 테이블 생성
CREATE TABLE "ProductLike" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "ProductLike_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProductLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
    CONSTRAINT "ProductLike_userId_productId_key" UNIQUE ("userId", "productId")
);

-- ArticleLike 테이블 생성
CREATE TABLE "ArticleLike" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "articleId" UUID NOT NULL,

    CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ArticleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE,
    CONSTRAINT "ArticleLike_userId_articleId_key" UNIQUE ("userId", "articleId")
);

-- updatedAt 자동 업데이트를 위한 함수 및 트리거 추가
-- 모든 테이블의 "updatedAt" 필드를 자동으로 업데이트하는 범용 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
    END;
    $$ language 'plpgsql';

-- 각 테이블에 UPDATE가 발생하기 전에 위 함수를 실행하는 트리거를 생성
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User" FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_updated_at 
    BEFORE UPDATE ON "Product" FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_article_updated_at 
    BEFORE UPDATE ON "Article" FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comment_updated_at 
    BEFORE UPDATE ON "Comment" FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_productlike_updated_at 
    BEFORE UPDATE ON "ProductLike" FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_articlelike_updated_at 
    BEFORE UPDATE ON "ArticleLike"  FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();