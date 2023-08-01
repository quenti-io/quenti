UPDATE "FolderExperience" SET "cardsAnswerWith" = 'Definition';
UPDATE "StudySetExperience" SET "cardsAnswerWith" = 'Definition';

-- AlterTable
ALTER TABLE "FolderExperience" ALTER COLUMN "cardsAnswerWith" SET DEFAULT 'Definition';

-- AlterTable
ALTER TABLE "StudySetExperience" ALTER COLUMN "cardsAnswerWith" SET DEFAULT 'Definition';
