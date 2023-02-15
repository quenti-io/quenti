-- CreateEnum
CREATE TYPE "MultipleAnswerMode" AS ENUM ('One', 'All', 'Unknown');

-- AlterTable
ALTER TABLE "StudySetExperience" ADD COLUMN     "multipleAnswerMode" "MultipleAnswerMode" NOT NULL DEFAULT 'Unknown';
