/*
  Warnings:

  - The `definitionLanguage` column on the `SetAutoSave` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wordLanguage` column on the `SetAutoSave` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `definitionLanguage` column on the `StudySet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wordLanguage` column on the `StudySet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SetAutoSave" DROP COLUMN "definitionLanguage",
ADD COLUMN     "definitionLanguage" TEXT NOT NULL DEFAULT 'en',
DROP COLUMN "wordLanguage",
ADD COLUMN     "wordLanguage" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "StudySet" DROP COLUMN "definitionLanguage",
ADD COLUMN     "definitionLanguage" TEXT NOT NULL DEFAULT 'en',
DROP COLUMN "wordLanguage",
ADD COLUMN     "wordLanguage" TEXT NOT NULL DEFAULT 'en';

-- DropEnum
DROP TYPE "Language";
