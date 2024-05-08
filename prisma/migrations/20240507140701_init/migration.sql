/*
  Warnings:

  - You are about to drop the column `createdByName` on the `Post` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdByName_fkey";

-- DropIndex
DROP INDEX "Post_content_idx";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdByName",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
