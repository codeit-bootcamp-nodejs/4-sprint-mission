BEGIN;

CREATE TABLE "public"."Product"(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    tags TEXT[] NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    userId INTEGER
);

CREATE TABLE "public"."Article"(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    userId INTEGER
);

CREATE TABLE "public"."Comment"(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    userId INTEGER,
    productId INTEGER,
    articleId INTEGER
);

CREATE TABLE "public"."Image"(
    id SERIAL PRIMARY KEY,
    publicId TEXT UNIQUE NOT NULL,
    url TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,
    
    userId INTEGER UNIQUE,
    productId INTEGER,
    articleId INTEGER
);

CREATE TABLE "public"."User"(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refreshToken VARCHAR(512) UNIQUE, 
    providerId VARCHAR(255),
    providerType VARCHAR(255),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    -- 소셜 로그인 고유성 보장
    CONSTRAINT user_provider_unique UNIQUE (providerType, providerId),

    -- providerType / providerId 둘 다 NULL 또는 둘 다 NOT NULL만 허용
    CONSTRAINT user_provider_check CHECK (
        (providerType IS NULL AND providerId IS NULL)
        OR (providerType IS NOT NULL AND providerId IS NOT NULL)
    )
);

CREATE TABLE "public"."ProductLike"(
    userId INTEGER NOT NULL, 
    productId INTEGER NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLike_pkey" PRIMARY KEY ("userId", "productId")
);

CREATE TABLE "public"."ArticleLike"(
    userId INTEGER NOT NULL,
    articleId INTEGER NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("userId", "articleId")
);

-- 제약 조건 설정

-- 외래키 설정
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."ArticleLike" ADD CONSTRAINT "ArticleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 추가 제약조건
ALTER TABLE "Image" ADD CONSTRAINT "image_owner_check" 
CHECK ("userId" IS NOT NULL OR "productId" IS NOT NULL OR "articleId" IS NOT NULL);

ALTER TABLE "Comment" ADD CONSTRAINT "comment_owner_check" 
CHECK ("productId" IS NOT NULL OR "articleId" IS NOT NULL);

-- updatedAt 자동 설정 트리거

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."User"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."Image"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."Product"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."ProductLike"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."Profile"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."Article"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."ArticleLike"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON "public"."Comment"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

COMMIT;
