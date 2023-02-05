-- CreateEnum
CREATE TYPE "StudySetAnswerMode" AS ENUM ('Word', 'Definition', 'Both');

-- AlterTable
ALTER TABLE "StudySetExperience" ADD COLUMN     "answerWith" "StudySetAnswerMode" NOT NULL DEFAULT 'Definition',
ADD COLUMN     "studyStarred" BOOLEAN NOT NULL DEFAULT false;
