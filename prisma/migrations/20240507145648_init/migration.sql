/*
  Warnings:

  - You are about to drop the column `createdById` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,image]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdByAvatar` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdById",
ADD COLUMN     "createdByAvatar" TEXT NOT NULL,
ADD COLUMN     "createdByName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_content_idx" ON "Post"("content");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_image_key" ON "User"("name", "image");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdByName_createdByAvatar_fkey" FOREIGN KEY ("createdByName", "createdByAvatar") REFERENCES "User"("name", "image") ON DELETE RESTRICT ON UPDATE CASCADE;
