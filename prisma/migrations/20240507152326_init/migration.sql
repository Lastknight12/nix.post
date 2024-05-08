/*
  Warnings:

  - You are about to drop the column `createdByAvatar` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdByName` on the `Post` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdByName_createdByAvatar_fkey";

-- DropIndex
DROP INDEX "Post_content_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdByAvatar",
DROP COLUMN "createdByName",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
