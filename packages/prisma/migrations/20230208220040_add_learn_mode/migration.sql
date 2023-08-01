-- CreateEnum
CREATE TYPE "LearnMode" AS ENUM ('Learn', 'Review');

-- AlterTable
ALTER TABLE "StudySetExperience" ADD COLUMN     "learnMode" "LearnMode" NOT NULL DEFAULT 'Learn';
