/*
  Warnings:

  - You are about to drop the column `userId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ArticleComment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductComment` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleComment" DROP CONSTRAINT "ArticleComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductComment" DROP CONSTRAINT "ProductComment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."ArticleComment" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."ProductComment" DROP COLUMN "userId";

-- DropTable
DROP TABLE "public"."User";
