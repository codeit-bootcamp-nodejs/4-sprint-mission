/*
  Warnings:

  - The primary key for the `article_comment_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `article_comment_likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."article_comment_likes" DROP CONSTRAINT "article_comment_likes_pkey",
DROP COLUMN "id";
