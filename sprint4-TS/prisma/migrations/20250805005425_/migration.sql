-- DropForeignKey
ALTER TABLE "public"."ArticleComment" DROP CONSTRAINT "ArticleComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductComment" DROP CONSTRAINT "ProductComment_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ProductComment" ADD CONSTRAINT "ProductComment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
