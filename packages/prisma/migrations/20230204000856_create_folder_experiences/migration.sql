-- CreateTable
CREATE TABLE "FolderExperience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL,
    "shuffleFlashcards" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FolderExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderExperience_userId_folderId_key" ON "FolderExperience"("userId", "folderId");

-- AddForeignKey
ALTER TABLE "FolderExperience" ADD CONSTRAINT "FolderExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderExperience" ADD CONSTRAINT "FolderExperience_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
