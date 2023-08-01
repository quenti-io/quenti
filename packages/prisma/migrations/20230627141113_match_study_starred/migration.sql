-- AlterTable
ALTER TABLE "FolderExperience" ADD COLUMN     "matchStudyStarred" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "StudySetExperience" ADD COLUMN     "matchStudyStarred" BOOLEAN NOT NULL DEFAULT false;
