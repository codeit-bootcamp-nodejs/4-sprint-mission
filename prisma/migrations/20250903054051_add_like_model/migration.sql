-- CreateTable
CREATE TABLE "public"."likes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articleId" INTEGER,
    "productId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_articleId_key" ON "public"."likes"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_productId_key" ON "public"."likes"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
