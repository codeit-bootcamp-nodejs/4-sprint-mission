/*
  Warnings:

  - Made the column `content` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Article" ALTER COLUMN "content" SET NOT NULL;
