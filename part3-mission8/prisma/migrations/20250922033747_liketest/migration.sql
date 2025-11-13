/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ArticleLikes" DROP CONSTRAINT "_ArticleLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ArticleLikes" DROP CONSTRAINT "_ArticleLikes_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CommentLikes" DROP CONSTRAINT "_CommentLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CommentLikes" DROP CONSTRAINT "_CommentLikes_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductLikes" DROP CONSTRAINT "_ProductLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductLikes" DROP CONSTRAINT "_ProductLikes_B_fkey";

-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "likeCount";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "likeCount";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "likeCount";

-- DropTable
DROP TABLE "public"."_ArticleLikes";

-- DropTable
DROP TABLE "public"."_CommentLikes";

-- DropTable
DROP TABLE "public"."_ProductLikes";

-- CreateTable
CREATE TABLE "public"."ProductLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommentLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductLike_userId_productId_key" ON "public"."ProductLike"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_userId_articleId_key" ON "public"."ArticleLike"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "public"."CommentLike"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleLike" ADD CONSTRAINT "ArticleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
