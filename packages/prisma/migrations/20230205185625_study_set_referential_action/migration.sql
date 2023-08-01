-- DropForeignKey
ALTER TABLE "StudySet" DROP CONSTRAINT "StudySet_userId_fkey";

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
