/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `content` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Article" ALTER COLUMN "content" SET NOT NULL;

-- DropTable
DROP TABLE "public"."comment";
