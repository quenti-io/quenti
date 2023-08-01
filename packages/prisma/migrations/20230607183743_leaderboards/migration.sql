-- CreateEnum
CREATE TYPE "LeaderboardType" AS ENUM ('Match');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "changelogVersion" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "containerId" TEXT NOT NULL,
    "studySetId" TEXT,
    "folderId" TEXT,
    "type" "LeaderboardType" NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highscore" (
    "leaderboardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "Highscore_pkey" PRIMARY KEY ("leaderboardId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_id_containerId_type_key" ON "Leaderboard"("id", "containerId", "type");

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highscore" ADD CONSTRAINT "Highscore_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "Leaderboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highscore" ADD CONSTRAINT "Highscore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
