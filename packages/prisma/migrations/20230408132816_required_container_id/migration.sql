/*
 Warnings:

 - Added the required column `containerId` to the `StudiableTerm` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE
  "StudiableTerm"
ADD
  COLUMN "containerId" TEXT NOT NULL GENERATED ALWAYS AS (COALESCE("experienceId", "folderExperienceId")) STORED;
