/*
  Warnings:

  - You are about to drop the `_ProductToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postUserId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProductToUser" DROP CONSTRAINT "_ProductToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToUser" DROP CONSTRAINT "_ProductToUser_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "postUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ProductToUser";

-- CreateTable
CREATE TABLE "_likedProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_likedProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_likedProduct_B_index" ON "_likedProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_postUserId_fkey" FOREIGN KEY ("postUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedProduct" ADD CONSTRAINT "_likedProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedProduct" ADD CONSTRAINT "_likedProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
