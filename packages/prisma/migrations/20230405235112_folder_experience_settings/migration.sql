-- AlterTable
ALTER TABLE "FolderExperience" ADD COLUMN     "cardsAnswerWith" "LimitedStudySetAnswerMode" NOT NULL DEFAULT 'Word',
ADD COLUMN     "cardsStudyStarred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableCardsSorting" BOOLEAN NOT NULL DEFAULT false;
