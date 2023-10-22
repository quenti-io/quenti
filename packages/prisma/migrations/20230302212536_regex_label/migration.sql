/*
  Warnings:

  - Added the required column `label` to the `AllowedEmailRegex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllowedEmailRegex" ADD COLUMN     "label" TEXT NOT NULL;
