-- CreateEnum
CREATE TYPE "StudiableMode" AS ENUM ('Flashcards', 'Learn');

-- CreateEnum
CREATE TYPE "LimitedStudySetAnswerMode" AS ENUM ('Word', 'Definition');

-- AlterTable
ALTER TABLE "StudiableTerm" ADD COLUMN     "mode" "StudiableMode" NOT NULL DEFAULT 'Learn';

-- AlterTable
ALTER TABLE "StudySetExperience" ADD COLUMN     "cardsAnswerWith" "LimitedStudySetAnswerMode" NOT NULL DEFAULT 'Word',
ADD COLUMN     "cardsStudyStarred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableCardsSorting" BOOLEAN NOT NULL DEFAULT false;
