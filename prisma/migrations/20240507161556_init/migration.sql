-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdByUserId_fkey";

-- DropIndex
DROP INDEX "User_name_key";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
