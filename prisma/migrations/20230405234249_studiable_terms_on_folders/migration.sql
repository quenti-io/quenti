-- AlterTable
ALTER TABLE "StudiableTerm" ADD COLUMN     "folderExperienceId" TEXT,
ALTER COLUMN "experienceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudiableTerm" ADD CONSTRAINT "StudiableTerm_folderExperienceId_fkey" FOREIGN KEY ("folderExperienceId") REFERENCES "FolderExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
