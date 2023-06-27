/*
  Warnings:

  - The primary key for the `Highscore` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Highscore" DROP CONSTRAINT "Highscore_pkey",
ADD CONSTRAINT "Highscore_pkey" PRIMARY KEY ("leaderboardId", "userId", "eligible");
