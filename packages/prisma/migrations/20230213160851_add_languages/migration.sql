-- CreateEnum
CREATE TYPE "Language" AS ENUM ('English', 'Spanish', 'French', 'Chemistry', 'Other');

-- AlterTable
ALTER TABLE "StudySet" ADD COLUMN     "definitionLanguage" "Language" NOT NULL DEFAULT 'English',
ADD COLUMN     "wordLanguage" "Language" NOT NULL DEFAULT 'English';
