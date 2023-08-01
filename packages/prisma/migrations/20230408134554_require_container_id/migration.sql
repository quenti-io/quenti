/*
  Warnings:

  - The primary key for the `StudiableTerm` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "StudiableTerm" DROP CONSTRAINT "StudiableTerm_pkey",
ALTER COLUMN "containerId" DROP EXPRESSION,
ADD CONSTRAINT "StudiableTerm_pkey" PRIMARY KEY ("userId", "termId", "containerId", "mode");
